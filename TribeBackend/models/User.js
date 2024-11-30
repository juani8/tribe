const mongoose = require('mongoose');

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
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    totpSecret: {
        type: String,
        required: true
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
        type: String,
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

module.exports = mongoose.model('User', userSchema);