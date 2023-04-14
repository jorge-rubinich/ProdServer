const express = require('express')
const dotenv = require('dotenv')
const productRouter = require("./routes/products.js")
const cartRouter = require("./routes/carts.js")
const path = require('path')

const envFile = path.join(__dirname, '.env')
console.log(envFile)
dotenv.config({path: envFile})


const PORT = process.env.PORT || 4000
const app= express()

app.use(express.static('./public'))
// intentando subir un archivo
//app.post("/", uploader.single('file'))

app.use(express.json())  //para que pueda recibir Jsons en la peticion..OJO!!!!
// si vamos a usar query (url con ?) hay que agregar la prox linea
app.use(express.urlencoded({extended: true}))
// y se reciben en req.query
app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)


app.listen(PORT, ()=>{
    console.log(`Escuchando en puerto ${PORT}`)
})
