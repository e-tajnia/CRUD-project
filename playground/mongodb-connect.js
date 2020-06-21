const mongoClient = require('mongodb').MongoClient;
mongoClient.connect("mongodb://localhost:27017/Todos",(err,client)=>{
    
    if (err) {
        return console.log("connection is error")
    }

    const db = client.db('Todos')

    db.collection('Todos').insertOne({
        text : "first connection",
        completed : true
    },(err,result)=>{
        if (err) {
            return console.log("connection is error")
        }
        console.log(JSON.stringify(result.ops,undefined,2))
    
    })

    db.collection('Users').insertOne({
        name : "eli",
        age : 29,
        location : "tehran"
    },(err,result)=>{
        if (err) {
            return console.log("connection is error")
        }
        console.log(JSON.stringify(result.ops,undefined,2))
    
    })

    client.close();
})