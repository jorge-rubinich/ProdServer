const express = require('express')
const ProductManager = require('../ProductManager.js')
const {uploader} = require('../utils.js')
const multer = require('multer');
const productRouter = express.Router()

const productPath= process.env.PRODUCTS_PATH || "./files/productos.json"


const pm = new ProductManager(productPath)

// add a new product
productRouter.post('/', uploader.single('file'), async (req, res)=>{
    console.log(req.body)
    console.log(req.file)
    let newProduct= req.body
    
    const result= await pm.addProduct(newProduct)
    return res.status(result.status=="ok"?200:400).send(result)
}) 


productRouter.get('/', async (req,res)=>{
    let {limit } = req.query
    if (!limit ) {limit =0}
    const result=await pm.getProducts(limit)
    return res.status(result.status=="ok"?200:404).send(result)
})

productRouter.get('/:pid', async (req, res)=>{
    const result=await pm.getProductById(req.params.pid)
    return res.status(result.status=="ok"?200:404).send(result)
}) 



// modify a product
productRouter.put('/:pid', async (req, res)=>{
    let idToModify= req.params.pid
    let updatedProduct = req.body
    const result= await pm.updateProduct(idToModify, updatedProduct)
    return res.status(result.status=="ok"?200:404).send(result)
}) 

// delete a product
productRouter.delete('/:pid', async (req, res)=>{
    let idToDelete= req.params.pid
    const result= await pm.deleteProductById(idToDelete)
    return res.status(result.status=="ok"?200:404).send(result)
}) 

module.exports  = productRouter