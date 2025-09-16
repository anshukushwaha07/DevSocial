const express = require('express');
const router = express.Router();
const passport = require('passport');
const { testUserRoute, githubCallback,getMyProfile } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware'); 

// Test route
router.get('/test', testUserRoute);

// @desc    Auth with GitHub (starts the flow)
// @route   GET /api/users/auth/github
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// @desc    GitHub auth callback
// @route   GET /api/users/auth/github/callback
router.get(
    '/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: `${process.env.FRONTEND_URL}/login/failed`, // Redirect on failure
        session: false // We are using JWTs, so no sessions needed
    }),
    githubCallback // On success, call our controller
);

router.get('/me', protect, getMyProfile);

module.exports = router;