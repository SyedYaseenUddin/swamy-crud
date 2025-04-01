const sqlite3 = require('sqlite3').verbose();

const path = require('path');
const dbPath = path.join(__dirname, 'database.db'); // Adjust the path as needed

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// create database tables
const createTables = () => {
  // Create database tables if they don't exist
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`);
    
        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            image TEXT,
            created_at TEXT DEFAULT (datetime('now', 'localtime'))
        )`);
    
        db.run(`CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now', 'localtime'))
        )`);
    });
}

// Export the database connection for use in other modules  
// Call the function to create tables
module.exports = {db, createTables};