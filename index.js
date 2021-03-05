const express = require('express')
let app = express()
require('./database/sequelize')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
const port = process.env.PORT || 8000
const userRouters = require('./routes/users')
app.use('/user', userRouters)
app.listen(port, () => console.log(`Express server currently running on port  ${port}`))