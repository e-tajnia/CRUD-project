const { ObjectID } = require('mongodb');

const mongoClient = require('mongodb').MongoClient;

mongoClient.connect("mongodb://localhost:27017/Todos",(err,client)=>{
    if (err) {
        return console.log("connection is error")
    }

    const db = client.db('Todos')

    // db.collection('Todos').find().toArray().then((doc)=>{
    //     console.log('find is ok')
    //     console.log(JSON.stringify(doc,undefined,2))
    // },(err)=>{
    //     console.log('error is:',err)
    // })

    // db.collection('Todos').find({completed: false}).toArray().then((doc)=>{
    //     console.log('find completed')
    //     console.log(JSON.stringify(doc,undefined,2))
    // },(err)=>{
    //     console.log('error is:',err)
    // })

    // db.collection('Todos').find({_id: new ObjectID('5ee8c0b579611018642de8b1')}).toArray().then((doc)=>{
    //     console.log('find completed')
    //     console.log(JSON.stringify(doc,undefined,2))
    // },(err)=>{
    //     console.log('error is:',err)
    // })

    db.collection('Todos').find().count().then((count)=>{
        console.log('find counts' ,count)
    },(err)=>{
        console.log('error is:',err)
    })

    client.close();
})