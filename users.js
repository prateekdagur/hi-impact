const express = require('express')
const Cryptr = require('cryptr')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')
const UsersAccessToken = require('../models/access_token')
const userAuthentication = require('../middleware/auth')
const cryptr = new Cryptr('mySecretKey')
const router = express.Router()

router.post('/register_user_', async function (req, res){
    
    try{
        if (!req.body.password){
            res.send({
                message: "please provide password"})
           }
            const encryptedPassword = cryptr.encrypt(req.body.password)
            let createUser = await UserModel.create({
                Username: req.body.Username,
                contact_no: req.body.contact_no,
                password: encryptedPassword
            })
               res.send(createUser)
        } catch(e){
            res.status(500).send(e.message)
        }
    })
    router.post('/login', async (req, res) => {
        try{
            const Username = req.body.Username
            const password = req.body.password
            const user =  await UserModel.findOne({ where: {"Username":  Username}})
            if(!user){
                throw new Error("no such username")
            }
            const decryptedString = cryptr.decrypt(user.password);
          
            if(decryptedString != password){
                throw new Error("no match of password")
            }
            const token = jwt.sign({id: user.id}, 'secretKey')
            const data = await UsersAccessToken.create({
                user_id: user.id,
                access_token: token

            })
            res.send(data)
        } catch (e) {
            res.status(400).send()
        }
        })
        router.get('/get_allusers', async (req, res) => {
             try{
                 const users = await UserModel.findAll()
                 for(user in users){
                 const decryptedString = cryptr.decrypt(users[user].password);
                 users[user]["password"] = decryptedString
                 }
                
                 res.send(users)
             }
             catch (e){
                 res.status(401).send(e)
             }
         })
         router.delete('/delete_user', userAuthentication.auth, async (req, res) => {
            try{
                const deleteUser = await UserModel.destroy({where: {id: req.user.user_id }})
                res.json({
                    message: 'user deleted'
                })
            } catch (e){
                res.status(401).send(e.message)
            }
        })
module.exports = router
            