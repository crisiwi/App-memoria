const mongoose = require('mongoose');

const carreraSchema = new mongoose.Schema({
    carrera: String
})

const CarreraModel = mongoose.model('carreras', carreraSchema);
module.exports = CarreraModel;