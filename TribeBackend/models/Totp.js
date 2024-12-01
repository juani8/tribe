const mongoose = require('mongoose');

const totpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    totpSecret: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '10m' // Se elimina automáticamente después de 10 minutos
    }
}, { timestamps: true });

module.exports = mongoose.model('Totp', totpSchema);