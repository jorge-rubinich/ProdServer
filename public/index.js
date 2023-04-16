
function sendForm() {

  formData = new FormData()  
  // Obtener los datos del formulario y cargar el objeto formData
 formData.append('code', document.getElementById('code').value)
 formData.append('title', document.getElementById('title').value)
 formData.append('description', document.getElementById('description').value)
 formData.append('price', document.getElementById('price').value)
 formData.append('category', document.getElementById('category').value)
 //formData.append('thumbnail', document.getElementById('thumbnails').value)
 formData.append('stock', document.getElementById('stock').value)

 const imageInput = document.querySelector('input[type="file"]');
 formData.append('file', imageInput.files[0]);

// 
 fetch('//localhost:5000/api/products', {
  method: 'POST',
  body: formData,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data'}  
})
 .then(response => response.json())
 .then(resData => {
    if (resData.status=="ok") {
      console.log("recibido todo ok")
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