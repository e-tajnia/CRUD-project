var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {ObjectID, ObjectId} = require('mongodb')
const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const todo = require('./models/todo')
const {authenticate} = require('./middleware/authenticate')

var app = express()
app.use(bodyParser.json())

app.post('/todos',(req,res)=>{
   var todo = new Todo({
       text : req.body.text
   })
   todo.save().then((doc)=>{
       res.send(doc)
   },(e)=>{
       res.status(400).send(e)
   })
})

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos})
    },(e)=>{
        res.status.send(e)
    })
})

app.get("/todos/:id",(req,res)=>{
    var id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    Todo.findById(id).then((todo)=>{
        if (!todo) {
            return res.status(404).send()
        }
        res.send({todo})
    }).catch(()=>{
        return res.status(404).send()
    })
    
})

app.delete('/todos/:id' , (req,res)=>{
    var id= req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    Todo.findByIdAndDelete(id).then((todo)=>{
        if (!todo) {
            return res.status(404).send()
        }
        res.send({todo})
    }).catch((e)=>{
        return res.status(404).send()
    })
})

app.patch('/todos/:id',(req,res)=>{
    var id = req.params.id
    var body = _.pick(req.body,['text','completed'])

    if(!ObjectId.isValid(id)){
        return res.status(404).send()
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completeAt = new Date().getTime()
    }
    else{
        body.completed = false
        body.completeAt = null
    }

    Todo.findByIdAndUpdate(id,{$set : body},{new : true}).then((todo)=>{
        if (!todo) {
            return res.status(404).send()
        }
        res.send(todo)
    }).catch((e)=>{
        return res.status(404).send()
    })
})

app.post('/users',(req,res)=>{
    var body = _.pick(req.body,['email','password'])
    var user = new User(body)

    user.save().then(()=>{
        return user.generateAuthToken()
       }).then((token)=>{
            res.header('x-auth',token).send(user)
       }).catch((e)=>{
            res.status(400).send()
    })
})

app.get('/user/me', authenticate ,(req,res)=>{
    res.send(req.user)
})

app.listen(3000,()=>{
    console.log('server work')
})

module.exports = {app}