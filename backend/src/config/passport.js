const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user.model');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/users/auth/github/callback" 
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Find if a user with this githubId already exists
            let user = await User.findOne({ githubId: profile.id });

            if (user) {
                // If user exists, pass the user object to the next middleware
                return done(null, user);
            } else {
                // If not, create a new user in our database
                const newUser = new User({
                    githubId: profile.id,
                    username: profile.username,
                    displayName: profile.displayName || profile.username,
                    avatarUrl: profile.photos[0].value,
                    profileUrl: profile.profileUrl
                });
                await newUser.save();
                return done(null, newUser);
            }
        } catch (error) {
            return done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});