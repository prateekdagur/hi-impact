const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')

const User = sequelize.define("user_details",{
    Username:{
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
    },
    contact_no:{
        type: Sequelize.INTEGER(20),
        allowNull: false,
        validate:  {
            isNumeric: true,
          len:{
                args:[10, 13],
                msg:"Min length of the phone number is 10"
              }
        }
    },
     password: { 
        type: Sequelize.STRING(200),
        allowNull: false,
       },
})
User.sync().then(function(){
    return ''
})

module.exports = User