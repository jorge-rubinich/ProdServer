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
    try {
        let {limite } = req.query
        if (!limite ) {limite =0}
        const products=await pm.getProducts(limite)
        res.status(200).send({status: 'SUCCESS', data: products})
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            error: 'Se ha producido un error accediendo a la base de productos '+error
        })
    }
})

app.get('/api/products/:pid', async (req, res)=>{
    product=await pm.getProductById(req.params.pid)
    if (product===undefined) {
       res.status(404).send({
        status: "ERROR",
        error: 'No existe producto con id '+req.params.pid+'.'
       })
    } else {
    res.status(200).send({status: 'SUCCESS', data: product})
}
}) 

app.post('/api/products', async (req, res)=>{
    let newProduct= req.body
    result= await pm.addProduct(newProduct)
    if (result=="ok") {res.status(200).send({status: 'SUCCESS', data: "ok"})}
    
    res.status(404).send({ status: "ERROR", error: result  })
}) 

const PORT = 5000

app.listen(PORT, ()=>{
    console.log(`Escuchando en puerto ${PORT}`)
    console.log('ENDPOINTS:')
    console.log(`http://localhost:${PORT}/api/products/?limite={limite}     retorna la cantidad {limite} de productos. Todos si se omite.`)
    console.log(`http://localhost:${PORT}/api/products/{id}                 retorna el producto con la id dada`)
    
})


