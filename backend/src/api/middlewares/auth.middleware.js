const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');

const protect = async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
          
            token = req.headers.authorization.split(' ')[1];

         
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Move on to the next middleware or the route's controller
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };