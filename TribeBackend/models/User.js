const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  lastName: {
    type: String
  },
  gender: {
    type: String,
    enum: ['masculino', 'femenino', 'no binario', 'otro', 'prefiero no decir']
  },
  profileImage: {
    type: String
  },
  coverImage: {
    type: String
  },
  description: {
    type: String
  },
  gamificationLevel: {
    type: String
  },
  numberOfFollowers: {
    type: Number,
    default: 0
  },
  numberOfFollowing: {
    type: Number,
    default: 0
  },
  numberOfComments: {
    type: Number,
    default: 0
  },
  numberOfFavorites: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Esto añade createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('User', UserSchema);
