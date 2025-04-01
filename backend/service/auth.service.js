const {db} = require('../dbConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



module.exports = {

    registerUser: (req, res) => {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        // Check if username already exists 
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) return res.status(400).json({ error: 'Username already exists' });
            
            // Hash the password
            const hashedPassword = bcrypt.hashSync(password, 10);
    
            // Insert new user into the database
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
            
        });
            res.status(201).json({ message: 'User registered successfully' });
        });
        
    },

    login: (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
    
        // Check if the user exists
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!user) return res.status(400).json({ error: 'Invalid username or password' });
            // Compare the password
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) return res.status(400).json({ error: 'Invalid username or password' });
            // Generate a JWT token
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '1h' });
            // Send the token to the client 
            res.json({ message: 'Login successful', token });
        });
    }

}

 