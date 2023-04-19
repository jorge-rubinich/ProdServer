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
        <table>
            <tr>
                <td><label for="code">Código:</label></td>
                <td><input id="code" name="code" required value= '${prod.code}' ></td>
            </tr>
            <tr>
                 <td><label for="title">Producto:</label></td>
                 <td><input type="text" id="title" name="title" required value= '${prod.title}' ></td>
            </tr>
            <tr>
                <td><label for="description">Descripción:</label></td>
            	<td><textarea id="description" name="description" rows="3" cols="50" required >${prod.description}</textarea></td>
            </tr>
            <tr>
                <td><label for="price">Precio:</label></td>
                <td><input type="text" id="price" name="price" required value=${prod.price} ></td>
            </tr>
            <tr>
                <td><label for="category">Categoría:</label></td>
                <td><input id="category" name="category" required value= '${prod.category}' ></td>
            </tr>

            <tr>
                <td><label for="stock">Stock:</label></td>
                <td><input type="text" id="stock" name="stock" required value= ${prod.stock} ></td>
            </tr>
            <tr>
                <td><label for="thumbnail">Selecciona archivo de imagen:</label></td>
                <td><input type="file" id="thumbnail" name="thumbnail" required value= '${prod.thumbnail}' ></td>
            </tr>
        </table>
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
