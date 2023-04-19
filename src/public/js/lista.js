const socket = io()
socket.emit('connection')

let productBuffer=[]

socket.on('dataChange', data => {
    productBuffer=data
    tableDraw(data)
})

socket.on('error', errorData =>{
    alert('No se puede completar la operación. Error: \n'+errorData)
})

tableDraw = (products) =>{
    let prodList= '<table><tr> <th>Código</th> <th>Producto</th>  <th>precio</th> <th>Stock</th> <th></th> </tr>'

    products.forEach(prod => {
        prodList+= '<tr>'
        prodList+= `<td>${prod.code} </td> `
         prodList+= `<td>${prod.title} </td> `
        prodList+= `<td>$${prod.price} </td> `
        prodList+= `<td>${prod.stock} </td> `
        prodList+= `<td><a href='#' onclick='editItem(${prod.id})'><img src="/static/img/edit.svg" alt="editar el producto"></a>     <a href='#' onclick='deleteItem(${prod.id})'><img src="/static/img/delete.svg" alt="Borrar el producto"></a> </td>`
        prodList+= '</tr>'
    })
    prodList+= '</table>'

    document.getElementById('productsTable').innerHTML=prodList
     
    // Hide the form,  in case it is displayed
    document.getElementById('ProductEditForm').innerHTML=""
 

}

deleteItem= (id) => {
    alert("Aqui pedir confirmación")
    socket.emit("deleteProduct", id)
}

editItem= (id) => {
    console.log(id)
    console.log(productBuffer)
    if(id) {
        // busco el producto con ese id.
        prod= productBuffer.find(elem =>elem.id== id)
        console.log(prod)
    } else {
        // genero un producto vacio
        prod ={ code:"", title:"", description:"", category: "", price:0, stock:"", thumbnail:[]}
    }

    editForm= `
    <h2>Formulario de productos</h2>
    <form>
        <ul>
            <li>
                <label for="code">Código:</label>
                <input id="code" name="code" required value= '${prod.code}' >
            </li>
            <li>
                 <label for="title">Producto:</label>
                 <input type="text" id="title" name="title" required value= '${prod.title}' >
            </li>
            <li>
                <label for="description">Descripción:</label>
            	<input id="description" name="description" required value= '${prod.description}' >
            </li>
            <li>
                <label for="price">Precio:</label>
                <input type="text" id="price" name="price" required value=${prod.price} >
            </li>
            <li>
                <label for="category">Categoría:</label>
                <input id="category" name="category" required value= '${prod.category}' >
            </li>

            <li>
                <label for="stock">Stock:</label>
                <input type="text" id="stock" name="stock" required value= ${prod.stock} >
            </li>
            <li>
                <label for="thumbnail">Selecciona archivo de imagen:</label>
                <input type="file" id="thumbnail" name="thumbnail" required value= '${prod.thumbnail}' >
            </li>
        </ul>
        <input type="button" id="botonCancelar" value="Cancelar">
        <input type="button" id="botonEnviar" value="Enviar">
    </form> `

    document.getElementById('ProductEditForm').innerHTML=editForm
    document.getElementById("botonEnviar").addEventListener("click", ()=>{sendData(id)});   
    document.getElementById("botonCancelar").addEventListener("click", ()=>{document.getElementById('ProductEditForm').innerHTML=""
});

}

sendData = (id)=>{
    code = document.getElementById('code').value
    title = document.getElementById('title').value
    description = document.getElementById('description').value
    price = document.getElementById('price').value
    category = document.getElementById('category').value
    thumbnail = document.getElementById('thumbnail').value
    stock = document.getElementById('stock').value

    const prodToUpdate= {code, title, description, price, category, thumbnail, stock }
    
    if (id) {
        // Tengo id, edito el producto.
        console.log("Sendata")

        socket.emit('updateProduct', {prodToUpdate, id})
    } else {
        // No tengo id. Es producto Nuevo.
        socket.emit('addProduct', prodToUpdate)
    }
    
}
