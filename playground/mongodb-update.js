const { ObjectID } = require('mongodb');

const mongoClient = require('mongodb').MongoClient;
mongoClient.connect("mongodb://localhost:27017/Todos",(err,client)=>{
    
    if (err) {
        return console.log("connection is error")
    }

    const db = client.db('Todos')

    // db.collection('Todos').findOneAndUpdate({
    //     _id : new ObjectID("5eea5184ebcf2f2128985749")
    // },{
    //     $set : {
    //         completed : false
    //     }
    // },{
    //     returnOriginal : false
    // }).then((result)=>{
    //     console.log(result)
    // })

    db.collection('Users').findOneAndUpdate({
        _id : new ObjectID("5eea5184ebcf2f212898574a")
    },{
        $inc : {
            age : 3
        }
    },{
        returnOriginal : false
    }).then((result)=>{
        console.log(result)
    })

    client.close();
})