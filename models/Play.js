const mongoose = require('mongoose')

const playSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        unique: true
    },
    description: {
        type: String,
        maxlength: 50,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        required: true
    },
    creator: String,
    usersLikes: [{ type: mongoose.Types.ObjectId, ref: "Play" }]
})

module.exports = mongoose.model('Play', playSchema)