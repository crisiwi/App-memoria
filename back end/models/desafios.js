const mongoose = require('mongoose');
const desafioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  carreras: {
    type: [String],
    required: true,
  },
//   idDesafio: {
//     type: Number,
//     unique: true
//   }
});

// Solo incrementar cuando el documento es nuevo
// desafioSchema.pre('save', function (next) {
//   if (this.isNew) {
//     mongoose.model('Desafio').countDocuments().then(res => {
//       this.idDesafio = res + 1; // Incrementar el conteo
//       next();
//       console.log('idDesafio:', this.idDesafio);
//     });
//   } else {
//     next();
//   }
// });

const DesafioModel = mongoose.model('Desafio', desafioSchema);
module.exports = DesafioModel;