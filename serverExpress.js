const express = require('express')

const app= express()

// GET  http://localhost:4000 /
app.get('/', (request, response)=>{
    response.send('Hola, mundo. aca estamos... ')
})

// GET  http://localhost:4000 /
app.get('/bienvenida', (request, response)=>{
    response.send('<h1>Bienvenido a mi server</h1>')
})

app.get('/usuario', (request, response)=>{
    response.send('<h3>Usuario Pepito</h3><p>Usuario Juan Pelotas<br>Edad:  25 años<br>Email:  jpelotas@gmail.com</p>')
})

const PORT = 4000

app.listen(PORT, ()=>{
    console.log(`Escuchando en puerto ${PORT}`)
})
