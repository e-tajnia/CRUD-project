const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')

var data = {
    id : 10
}
////sign
var token = jwt.sign(data,'123')
console.log(token)
///verify
var decode = jwt.verify(token,'123')
console.log(decode)

// var token1 ={
//     data ,
//     hash : SHA256(JSON.stringify(data + "secret"))
// }
// console.log(token1.hash)

// var message = "my age is 30"
// var  hash = SHA256(message).toString()
// console.log(message)
// console.log(hash)