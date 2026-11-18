// Carga de librerías
const express = require('express');
const mongoose = require('mongoose');

// Carga de enrutadores
const recintos = require(__dirname + '/routes/recintos');
const eventos = require(__dirname + '/routes/eventos');

// Conexión con la base de datos
// En Render se define la variable de entorno MONGODB_URI con la URL de MongoDB Atlas;
// en local se usa la base de datos de nuestro equipo
const urlBD = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventos';
mongoose.connect(urlBD);

// Servidor Express y middleware para peticiones JSON
let app = express();
app.use(express.json());

// Enrutadores
app.use('/recintos', recintos);
app.use('/eventos', eventos);

// Puesta en marcha del servidor (Render asigna el puerto en PORT)
const puerto = process.env.PORT || 8080;
app.listen(puerto, () => {
    console.log('Servidor escuchando en el puerto ' + puerto);
});
