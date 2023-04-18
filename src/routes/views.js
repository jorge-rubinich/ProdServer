const {Router} = require('express')
const router = Router()
const ProductManager = require('../ProductManager.js')

const productPath= process.env.PRODUCTS_PATH || "./files/productos.json"

const pm = new ProductManager(productPath)


// Es equivalente a lo que usamos en products.js
// const express = require('express')
// const productRouter = express.Router()

router.get('/', async (req, res)=>{

    const result=await pm.getProducts()
    const products=result.data

    let pageData={
        title:  'Lista de Productos',
        products,
        style: 'static/css/index.css'
    }

    res.render('index', pageData)
})

router.get('/lista',  (req, res)=>{

    let pageData={
        title:  'Lista de Productos en Realtime',
        style: 'static/css/index.css'
    }

    res.render('lista', pageData)
})

module.exports = router