const express = require('express')
const CartManager = require('../CartManager.js')
const ProductManager = require('../ProductManager.js')

const cartRouter = express.Router()

const cartPath= "./files/carts.json"
const productPath= "./files/productos.json"

const cm = new CartManager(cartPath)

const pm = new ProductManager(productPath)  //utilizo pm para verificar q exista el prod a agregar al carrito.


cartRouter.get('/:pid', async (req, res)=>{
    const result=await cm.getcartById(req.params.pid)
    return res.status(result.status=="ok"?200:404).send(result)
}) 

// create a new cart for the client. Return the cart id
cartRouter.post('/', async (req, res)=>{
    const result= await cm.createCart()
    console.log(result)
    return res.status(result.status=="ok"?200:400).send(result)
}) 

// modify a cart
cartRouter.post('/:cid/product/:pid', async (req, res)=>{
    let cartId= req.params.cid
    let productId= req.params.pid
    // primero verifico si el productId es valido.
    let result= await pm.getProductById(productId)
    if (result.status=="ok") {
        result= await cm.addToCart(cartId, productId)
    }
    return res.status(result.status=="ok"?200:404).send(result)
}) 

// delete a cart
cartRouter.delete('/:pid', async (req, res)=>{
    let idToDelete= req.params.pid
    const result= await cm.deletecartById(idToDelete)
    return res.status(result.status=="ok"?200:404).send(result)
}) 

module.exports  = cartRouter