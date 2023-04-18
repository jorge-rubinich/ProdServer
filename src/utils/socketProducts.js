const ProductManager = require("../ProductManager")
const productPath= process.env.PRODUCTS_PATH || "./files/productos.json"

pm = new ProductManager(productPath)

const socketProducts = (io)=>{
    io.on('connection', async socket => {
        console.log('Nuevo cliente conectado')
        sendProductsChange(socket)
        socket.on('deleteProduct', async id =>{
            console.log(id)
            result =await pm.deleteProductById(id)
            if (result.status="ok"){
                sendProductsChange()
            }
                
        })
    })

}

// Recover products from pm and send then to the client websocket
const sendProductsChange = async (socket)=>{
    let result = await  pm.getProducts()
    if (result.status='ok') {
        socket.emit('dataChange',result.data)
    }
}

module.exports = socketProducts