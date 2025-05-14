const { getDatabase } = require("../database")

const COLLECTION_NAME = "products"

class Product {
  constructor(name, description, price) {
    this.name = name
    this.description = description
    this.price = price
  }

  static add(product) {
    const db = getDatabase()

    db.collection(COLLECTION_NAME).findOne({ name: product.name }).then(existing => {
      if (existing) {
        console.log(`Product '${product.name}' already exists.`)
        return
      }

      db.collection(COLLECTION_NAME).insertOne(product)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }).catch(err => console.log(err))
  }

  static findByName(name) {
    const db = getDatabase()
    return db.collection(COLLECTION_NAME).findOne({ name })
  }

  static getAll(cb) {
    const db = getDatabase()

    db.collection(COLLECTION_NAME).find().toArray().then(products => {
      if (typeof cb === "function") cb(products)
    }).catch(err => {
      console.log(err)
      if (typeof cb === "function") cb([])
    })
  }

  static deleteByName(name) {
    const db = getDatabase()

    db.collection(COLLECTION_NAME).deleteOne({ name })
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  static getLast(cb) {
    const db = getDatabase()

    db.collection(COLLECTION_NAME)
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray()
      .then(products => {
        if (typeof cb === "function") cb(products[0])
      }).catch(err => {
        console.log(err)
        if (typeof cb === "function") cb(undefined)
      })
  }
}

module.exports = Product
