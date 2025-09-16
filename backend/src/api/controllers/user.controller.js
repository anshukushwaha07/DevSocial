
const generateToken = require('../../utils/generateToken');
const User = require('../../models/user.model');

// @desc    Test user route
// @route   GET /api/users/test
// @access  Public
const testUserRoute = (req, res) => {
    res.status(200).json({ message: 'User route is working!' });
};

// @desc    Handles the GitHub callback after authentication
// @route   GET /api/users/auth/github/callback
// @access  Public
const githubCallback = (req, res) => {
    // req.user is populated by Passport.js after successful authentication
    const token = generateToken(req.user._id);

    // Redirect to the frontend with the token
    // The frontend will then save this token and use it for authenticated requests
    res.redirect(`${process.env.FRONTEND_URL}/login/success?token=${token}`);
};

const getMyProfile = async (req, res) => {
    // The 'protect' middleware has already fetched the user and attached it to the request.
    // We just need to send it back.
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};


module.exports = {
    testUserRoute,
    githubCallback,
    getMyProfile 
};

