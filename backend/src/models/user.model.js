const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
    },
    avatarUrl: {
        type: String,
    },
    profileUrl: {
        type: String,
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);
module.exports = User;