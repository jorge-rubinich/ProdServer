const ProductManager = require("../ProductManager")
const productPath= process.env.PRODUCTS_PATH || "./files/productos.json"

pm = new ProductManager(productPath)

const socketProducts = (io)=>{
    io.on('connection', async socket => {
        console.log('Nuevo cliente conectado')
        sendProductsChange(socket)
        // mensaje   deleteProduct
        socket.on('deleteProduct', async id =>{
            console.log(id)
            result =await pm.deleteProductById(id)
            if (result.status=="ok"){
                sendProductsChange(socket)
            }
                
        })
        // mensaje   addProduct
        socket.on('addProduct', async prod => {
            result = await pm.addProduct(prod)
            if (result.status=="ok"){
                sendProductsChange(socket)
            } else {
                socket.emit('error', result.data)
            }
        })
        // mensaje   editProduct
        socket.on('updateProduct', async data => {
            const {prodToUpdate, id} = data
            result = await pm.updateProduct(id, prodToUpdate)
            if (result.status=="ok"){
                sendProductsChange(socket)
                console.log("Producto #"+id+" actualizado")
            } else {
                console.log(result.status)
                console.log(result.data)
                socket.emit('error', result.data)
            }
        })        
    })

}

// Recover products from pm and send then to the client websocket
const sendProductsChange = async (socket)=>{
    let result = await  pm.getProducts()
    if (result.status=='ok') {
        socket.emit('dataChange',result.data)
    }
}

module.exports = socketProducts