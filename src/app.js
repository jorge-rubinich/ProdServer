const express = require('express')
const productRouter = require("./routes/products.js")
const cartRouter = require("./routes/carts.js")


/* const {PORT } = dotenv.PORT
 */
const PORT = 5000

const app= express()

app.use(express.json())  //para que pueda recibir Jsons en la peticion..OJO!!!!
// si vamos a usar query (url con ?) hay que agregar la prox linea
app.use(express.urlencoded({extended: true}))
// y se reciben en req.query
app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)


app.listen(PORT, ()=>{
    console.log(`Escuchando en puerto ${PORT}`)
})
