const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Asegura que el correo sea único
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    entity: {
        type: String,
        required: true,
    },
    rol:{
        type: String,
        required: false,
    },
    carrera: {
        type: String,
        required: false,
    }
});


userSchema.path('entity').validate(function(value) {
    if (value === 'Estudiante') {
        return this.rol && this.carrera;  // Asegura que rol y carrera estén presentes
    }
    return true;  // Si el valor no es 'Estudiante', no requiere rol y carrera
}, 'Rol y carrera son requeridos para entidad Estudiante');

// Encriptar la contraseña
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar la contraseña en el login
userSchema.methods.comparePassword = async function(candidatePassword) {
    //Comparar contraseñas
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
