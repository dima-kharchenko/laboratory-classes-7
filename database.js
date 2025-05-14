const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const { DB_USER, DB_PASS } = require("./config")
let database

const mongoConnect = (callback) => {
    MongoClient.connect(
        `mongodb+srv://${DB_USER}:${DB_PASS}@mvc.1ut23ja.mongodb.net/`
    )
    .then((result) => {
        console.log("Connection to the database has been established.")
        database = result.db("shop")
        callback()
    })
    .catch((error) => console.log(error))
}

const getDatabase  = () => {
    if(!database) {throw new Error('No database found.')}
    return database
}

module.exports = { mongoConnect, getDatabase }