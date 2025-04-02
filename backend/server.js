const express = require('express');
const cors = require('cors');

const moment = require('moment');
const multer = require('multer');
const dotenv = require('dotenv');


const { db, createTables } = require('./dbConfig'); // Import the database connection and createTables function
const dispatcher = require('./dispatcher');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database connection
createTables(); // Call the function to create tables


// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage }); 



// Routes   
dispatcher(app);

// start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
