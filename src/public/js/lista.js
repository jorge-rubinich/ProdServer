const socket = io()
socket.emit('connection')


socket.on('dataChange', data => {
    tableDraw(data)
})

tableDraw = (products) =>{
    let prodList= '<table><tr> <th>Código</th> <th>Producto</th>  <th>precio</th> <th>Stock</th> <th>Acciones</th> </tr>'

    products.forEach(prod => {
        prodList+= '<tr>'
        prodList+= `<td>${prod.code} </td> `
         prodList+= `<td>${prod.title} </td> `
        prodList+= `<td>$${prod.price} </td> `
        prodList+= `<td>${prod.stock} </td> `
        prodList+= `<td>    `
        prodList+=`<a href='#' onclick='deleteItem(${prod.id})'>Borrar</a> </td> `
        prodList+= '</tr>'
    })
   // prodList+= '</table>'

    document.getElementById('productsTable').innerHTML=prodList
    
}

deleteItem= (id) => {
    alert("Aqui pedir confirmación")
    socket.emit("deleteProduct", id)
}