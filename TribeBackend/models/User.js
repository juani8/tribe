const mongoose = require('mongoose');
const {hash} = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    lastName: {
        type: String,
    },
    nickName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        // Esto se validará en el hook de pre-guardado
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    profileImage: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    description: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['masculino', 'femenino', 'no binario', 'otro', 'prefiero no decir'],
    },
    gamificationLevel: {
        type: Object,
        default: { level: 1, description: 'usuario nuevo' },
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    numberOfFollowers: {
        type: Number,
        default: 0,
    },
    numberOfFollowing: {
        type: Number,
        default: 0,
    },
    numberOfComments: {
        type: Number,
        default: 0,
    },
    numberOfPosts: {
        type: Number,
        default: 0,
    },
    numberOfFavorites: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Hook de pre-guardado para validar la contraseña en función de isGoogleUser.
userSchema.pre('save', async function(next) {
    if (!this.isGoogleUser && !this.password) {
        return next(new Error('Password is required for non-Google users.'));
    }

    if (this.password && !this.isGoogleUser) {
        hash(this.password, 10)
            .then(hashedPassword => {
                this.password = hashedPassword;
                next();
            })
            .catch(err => next(err));
    } else {
        next();
    }
});


module.exports = mongoose.model('User', userSchema);