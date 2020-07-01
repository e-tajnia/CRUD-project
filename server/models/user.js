const mongoose = require('mongoose')
const validator = require('validator') 
const jwt = require('jsonwebtoken')
const _ = require('lodash')

var userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        minLength :1,
        trim : true,
        validate : {
            validator : validator.isEmail,
            message : "این ایمیل معتبر نیست"
        }
    },
    password : {
        type : String,
        required : true,
        minLength : 6
    },
    tokens : [{
            access : {
                type : String,
                required : true
            },
            token : {
                type : String,
                required : true
            }
        }]
})

userSchema.methods.toJSON  = function(){
    var user = this;
    var userObject = user.toObject()
    
    return _.pick(userObject,['_id','email'])
}

userSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth'
    var token = jwt.sign({_id : user._id.toHexString(),access},'123abc').toString()
    user.tokens.push({access,token})
    return user.save().then(()=>{
        return token
    })
}

userSchema.statics.findByToken = function(token) {
    var User = this
    var decode

    try {
         decode =  jwt.verify(token,'123abc')
    } catch (error) {
        return Promise.reject()
    }
    return User.findOne({
        '_id' : decode._id,
        'tokens.token' : token,
        'tokens.access' : 'auth'
    }) 
}

var User = mongoose.model('User',userSchema)

module.exports = {User}