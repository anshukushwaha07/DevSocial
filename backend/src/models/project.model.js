const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    // The user who imported this project
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // This creates a reference to the User model
    },
    // The unique ID of the repository from GitHub
    githubId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    htmlUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ''
    },
    language: {
        type: String,
    },
    stargazersCount: {
        type: Number,
        default: 0
    },
    forksCount: {
        type: Number,
        default: 0
    },
    // We will add the AI summary here later
    aiSummary: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// To prevent a user from importing the same repo twice, we create a compound index.
// This ensures the combination of 'owner' and 'githubId' is always unique.
projectSchema.index({ owner: 1, githubId: 1 }, { unique: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;