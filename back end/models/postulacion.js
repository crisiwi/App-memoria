const mongoose = require('mongoose');

const PostulacionSchema = new mongoose.Schema({
    Prioridades: {
        type: [{ 
            idDesafio: {
                type: Number, // Referencia al id del desafío
                required: true
            }, 
            prioridad: {
                type: Number, // Prioridad (puede ser null o un valor numérico desde 1)
                min: 1, // Si no es null, debe ser al menos 1
                required: false
            }
        }],
        validate: {
            validator: function(arr) {
                return arr.length > 0; // Asegúrate de que el array tenga al menos 1 elemento
            },
            message: 'El array Prioridades debe tener al menos un elemento.'
        }
    },
    estudiante: {
        type: String, // Referencia a los estudiantes
        required: true
    }
});

const Postulacion = mongoose.model('Postulacion', PostulacionSchema);

module.exports = Postulacion;