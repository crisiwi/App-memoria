const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GrupoSchema = new Schema({
  id: {
    type: String, // El mismo id del desafío
    required: true,
  },
  nombre: {
    type: String, // El título del desafío
    required: true
  },
  estudiantes: [{
    type: String, // Referencia a los estudiantes
    required: false
  }]
});

const Grupo = mongoose.model('Grupo', GrupoSchema);
module.exports = Grupo;
