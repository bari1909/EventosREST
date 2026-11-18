const mongoose = require('mongoose');

// Esquema de los recintos
let recintoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        minlength: 10,
        trim: true
    },
    localidad: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    aforoMaximo: {
        type: Number
    }
});

let Recinto = mongoose.model('recintos', recintoSchema);

module.exports = Recinto;
