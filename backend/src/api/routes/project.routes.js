const express = require('express');
const router = express.Router();
const { getGithubRepos, importGithubRepo, getImportedProjects, generateAISummary } = require('../controllers/project.controller');
const { protect } = require('../middlewares/auth.middleware');


// @desc    Get the logged-in user's public repos from GitHub
// @route   GET /api/projects/github
// @access  Private
router.get('/github', protect, getGithubRepos);

// Import a selected repo into our database
router.post('/import', protect, importGithubRepo);

// Get all repos imported by a user from our database
router.get('/', protect, getImportedProjects);

// Generate an AI summary for a specific imported project
router.post('/:id/summarize', protect, generateAISummary);

module.exports = router;