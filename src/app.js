const express = require('express')
const dotenv = require('dotenv')
const productRouter = require("./routes/products.js")
const cartRouter = require("./routes/carts.js")
const viewsRouter = require("./routes/views.js")
const {Server} = require('socket.io')

const path = require('path')
const handlebars = require('express-handlebars')
const socketProducts = require('./utils/socketProducts.js')

const envFile = path.join(__dirname, '.env')
dotenv.config({path: envFile})

const PORT = process.env.PORT || 4000
const app= express()

const httpServer= app.listen(PORT, ()=>{
    console.log(`escuchando en el puerto ${PORT}.`)
    console.log("Probame en localhost:5000 y localhost:5000/lista")
    console.log('aun falta el agregar producto.')
})

const io = new Server(httpServer)

//  -- Handlebars -----  -------
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')
//  -- Handlebars -----  -------

app.use(express.json())  
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname+'/public'))
console.log(__dirname+'/public')
//app.use(express.static('/public'))

socketProducts(io)

app.use('/', viewsRouter)

app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)

/* app.listen(PORT, ()=>{
    console.log(`Escuchando en puerto ${PORT}`)
}) */
