require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const mainRouter = require('./src/api/routes/index');
const passport = require('passport'); 

// Initialize Passport config
require('./src/config/passport'); // This will execute the passport config file


// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

app.use(passport.initialize());

// API Routes
app.use('/api', mainRouter);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('devSocial API is running!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));