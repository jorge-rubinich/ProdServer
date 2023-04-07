const express = require('express')
const ProductManager = require('./ProductManager.js')

const path= "./files/productos.json"

const pm = new ProductManager(path)

const app= express()
// si vamos a usar query (url con ?) hay que agregar la prox linea
// y se reciben en req.query
app.use(express.json())  //para que pueda recibir Jsons en la peticion..OJO!!!!
app.use(express.urlencoded({extended: true}))

app.get('/api/products', async (req,res)=>{
    let {limite } = req.query
    if (!limite ) {limite =0}
    const result=await pm.getProducts(limite)
    return res.status(result.status=="ok"?200:404).send(result)
})

app.get('/api/products/:pid', async (req, res)=>{
    const result=await pm.getProductById(req.params.pid)
    return res.status(result.status=="ok"?200:404).send(result)
}) 

// add a new product
app.post('/api/products', async (req, res)=>{
    let newProduct= req.body
    const result= await pm.addProduct(newProduct)
    return res.status(result.status=="ok"?200:400).send(result)
}) 

// modify a product
app.put('/api/products/:pid', async (req, res)=>{
    let idToModify= req.params.pid
    let updatedProduct = req.body
    const result= await pm.updateProduct(idToModify, updatedProduct)
    return res.status(result.status=="ok"?200:404).send(result)
}) 

// delete a product
app.delete('/api/products/:pid', async (req, res)=>{
    let idToDelete= req.params.pid
    const result= await pm.deleteProductById(idToDelete)
    return res.status(result.status=="ok"?200:404).send(result)
}) 

const PORT = 5000

app.listen(PORT, ()=>{
    console.log(`Escuchando en puerto ${PORT}`)
    console.log('ENDPOINTS:')
    console.log(`http://localhost:${PORT}/api/products/?limite={limite}     retorna la cantidad {limite} de productos. Todos si se omite.`)
    console.log(`http://localhost:${PORT}/api/products/{id}                 retorna el producto con la id dada`)
    
})
