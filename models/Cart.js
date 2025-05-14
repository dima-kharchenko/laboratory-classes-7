const Product = require("./Product")
const { getDatabase } = require("../database")

const COLLECTION_NAME = 'carts'

class Cart {
  constructor(userId) {
    this.userId = userId
  }

  static add(userId, productName) {
    const db = getDatabase()

    Product.findByName(productName).then(prod => {
      if (!prod) throw new Error(`Product '${productName}' not found.`)

      db.collection(COLLECTION_NAME).findOne({ userId }).then(cart => {
        if (!cart) {
          const newCart = {
            userId,
            items: [{ product: prod, quantity: 1 }]
          }

          db.collection(COLLECTION_NAME).insertOne(newCart)
            .then(res => console.log(res)).catch(err => console.log(err))

          return
        }

        const idx = cart.items.findIndex(i => i.product.name === productName)

        if (idx > -1) cart.items[idx].quantity += 1
        else cart.items.push({ product: prod, quantity: 1 })

        db.collection(COLLECTION_NAME)
          .updateOne({ userId }, { $set: { items: cart.items } })
          .then(res => console.log(res)).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  }

  static getItems(userId, cb) {
    const db = getDatabase()

    db.collection(COLLECTION_NAME).findOne({ userId }).then(cart => {
      if (!cart || !cart.items) {
        if (typeof cb === "function") cb([])
        return
      }

      if (typeof cb === "function") cb(cart.items)
    }).catch(err => {
      console.log(err)
      if (typeof cb === "function") cb([])
    })
  }

  static getProductsQuantity(userId, cb) {
    const db = getDatabase()

    db.collection(COLLECTION_NAME).findOne({ userId }).then(cart => {
      if (!cart || !cart.items) {
        if (typeof cb === "function") cb(0)
        return
      }

      const total = cart.items.reduce((sum, i) => sum + i.quantity, 0)
      if (typeof cb === "function") cb(total)
    }).catch(err => {
      console.log(err)
      if (typeof cb === "function") cb(0)
    })
  }

  static getTotalPrice(userId, cb) {
    const db = getDatabase()

    db.collection(COLLECTION_NAME).findOne({ userId }).then(cart => {
      if (!cart || !cart.items) {
        if (typeof cb === "function") cb(0)
        return
      }

      const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
      if (typeof cb === "function") cb(total)
    }).catch(err => {
      console.log(err)
      if (typeof cb === "function") cb(0)
    })
  }

  static clearCart(userId) {
    const db = getDatabase()

    db.collection(COLLECTION_NAME).updateOne({ userId }, { $set: { items: [] } })
      .then(res => console.log(res)).catch(err => console.log(err))
  }
}

module.exports = Cart
