
function sendForm() {
  // Obtener los datos del formulario
const code = document.getElementById('code').value
 const title = document.getElementById('title').value
 const description = document.getElementById('description').value
 const price = document.getElementById('price').value
 const category = document.getElementById('category').value
 const thumbnail = document.getElementById('thumbnails').value
 const stock = document.getElementById('stock').value

 // Crear un objeto con los datos del formulario
 const dataToSend = {
   code, title, description, price, stock, category, "thumbnails": [thumbnail]
 }
 console.log(dataToSend)
 // Hacer la petición POST a la API
 fetch('//localhost:5000/api/products', {
   method: 'POST',
   headers: {'Content-Type': 'application/json'},
   body: JSON.stringify(dataToSend)
 })
 .then(response => response.json())
 .then(resData => {
    if (resData.status=="ok") {
      
    }else{
      alert(resData.data)
    }
 })
 .catch(error => {    console.error('Error:', error)  })
  }
  
  // Obtener el botón del formulario
  const botonEnviar = document.getElementById("sendButton")
  // Asignar la función al evento "click" del botón
  botonEnviar.addEventListener('click', sendForm)