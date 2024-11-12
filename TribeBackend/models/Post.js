const mongoose = require('mongoose');

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
        type: [String],
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
    },
    lastComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    totalComments: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // Añade createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Post', PostSchema);