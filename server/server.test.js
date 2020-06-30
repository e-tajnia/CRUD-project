const request=require('supertest')
const expect = require('expect')

const {app}= require('./server')
const {Todo}= require('./models/todo')
const { ObjectID } = require('mongodb')

const todos = [{
    _id : new ObjectID(),
    text : "salam"
},{
    _id : new ObjectID(),
    text : "khoobe",
    completed : true
}]

beforeEach((done)=>{
    Todo.deleteMany({}).then(()=>{
        return Todo.insertMany(todos)
    }).then(()=>done())
})

describe("post /todos",()=>{

    it("should create a new todos",(done)=>{
        var text = "kojaee"
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text)
            })
            .end((err,res)=>{
                if (err) {
                    return done(err)
                }

                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(3)
                    expect(todos[2].text).toBe(text)
                    done();
                }).catch((e)=> done(e))
            })
            
    })

    it("should create todo with invalide data",(done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if (err) {
                    return done(err)
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e)=>done(e))
            })
    })
})

describe("GET /todos",()=>{
    it("should Read all todos data",(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe("GET /todos:id",()=>{
    it("should Read one todos data",(done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })
})

describe("DELETE /todos:id",()=>{
    it("should delete data",(done)=>{
        var Hexid = todos[0]._id.toHexString()
        request(app)
            .delete(`/todos/${Hexid}`)
            .expect(200)
            .expect((res)=>{
                // console.log(res)
                expect(res.body.todo._id).toBe(Hexid)
            })
            
            .end((err,res)=>{
                if (err) {
                    return done(err)
                }

                Todo.findById(Hexid).then((todo)=>{
                    expect(todo).toBeNull()
                    done();
                })
            })
    })
})

describe("UPDATE /todos:id",()=>{
    it("should update data",(done)=>{
        var Hexid = todos[0]._id.toHexString()
        var text = "salam azizam"

        request(app)
            .patch(`/todos/${Hexid}`)
            .send({
                completed : true,
                text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text)
                expect(res.body.completed).toBe(true)
                expect(typeof res.body.completeAt).toBe('number')
            })
            .end(done)
    })

    it("should update completeAt",(done)=>{
        var Hexid = todos[1]._id.toHexString()
        var text = "salam azizam"

        request(app)
            .patch(`/todos/${Hexid}`)
            .send({
                completed : false,
                text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text)
                expect(res.body.completed).toBe(false)
                expect(res.body.completeAt).toBeNull()
            })
            .end(done)
    })
})

