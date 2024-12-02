const mongoose = require('mongoose');

const MultimediaSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['image', 'video'],
        required: true
    }
});

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
    },
    multimedia: {
        type: [MultimediaSchema],
        required: true
    },
    location: {
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
        city: {
            type: String,
        }
    }, 
    likes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Post', PostSchema);