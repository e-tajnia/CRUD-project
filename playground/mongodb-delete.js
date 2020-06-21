const mongoClient = require('mongodb').MongoClient;
mongoClient.connect("mongodb://localhost:27017/Todos",(err,client)=>{
    
    if (err) {
        return console.log("connection is error")
    }

    const db = client.db('Todos')

    // db.collection('Todos').deleteMany({text: 'salam'}).then((result)=>{
    //     console.log(result)
    // })

    // db.collection('Todos').deleteOne({completed: false}).then((result)=>{
    //     console.log(result)
    // })

    db.collection('Todos').findOneAndDelete({text: 'first'}).then((result)=>{
        console.log(result)
    })

    client.close();
})