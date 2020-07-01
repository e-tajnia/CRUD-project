const mongoose = require('mongoose')
const validator = require('validator') 
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

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

userSchema.pre('save',function(next){
    var user = this

    if (user.isModified('password')) {
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash
                next()
            })
        })
    }
    else{
        next()
    }
})

var User = mongoose.model('User',userSchema)

module.exports = {User}