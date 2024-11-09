const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    nickName: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profileImage: String,
    coverImage: String,
    description: String,
    gamificationLevel: String,
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    numberOfFollowers: { type: Number, default: 0 },
    numberOfFollowing: { type: Number, default: 0 },
    numberOfComments: { type: Number, default: 0 },
    numberOfFavorites: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);