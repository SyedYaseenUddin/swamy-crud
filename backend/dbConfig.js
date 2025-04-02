const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

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
        db.run(`CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rolename TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log("Role table created");
        

        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (role_id) REFERENCES roles (id)
        )`);

        console.log("users table created");


        db.run(`CREATE TABLE IF NOT EXISTS transaction_type (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log("transaction_type table created");


        db.run(`CREATE TABLE IF NOT EXISTS wallet (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            balance REAL NOT NULL DEFAULT 0.0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        console.log("wallet table created");
        

        db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wallet_id INTEGER NOT NULL,
            transaction_type_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            reff TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (wallet_id) REFERENCES wallet (id),
            FOREIGN KEY (transaction_type_id) REFERENCES transaction_type (id)
        )`);

        console.log("transactions table created");


        db.run(`INSERT OR IGNORE INTO roles (id, rolename) VALUES (1, 'admin')`);
        db.run(`INSERT OR IGNORE INTO roles (id, rolename) VALUES (2, 'user')`);
        db.run(`INSERT OR IGNORE INTO users (id, first_name, last_name, username, email, password, role_id) 
            VALUES (1, 'Admin', 'User', 'admin', 'admin@app.com', '${bcrypt.hashSync('Test@123',10)}', 1)`);
    });

    db.run(`INSERT OR IGNORE INTO transaction_type (id, name, description) VALUES (1, 'credit', 'Adding funds to the wallet')`);
    db.run(`INSERT OR IGNORE INTO transaction_type (id, name, description) VALUES (2, 'debit', 'Deducting funds from the wallet')`);
    db.run(`INSERT OR IGNORE INTO transaction_type (id, name, description) VALUES (3, 'interest', 'Interest added to the wallet')`);
    db.run(`INSERT OR IGNORE INTO transaction_type (id, name, description) VALUES (4, 'loan_credit', 'Loan amount credited to the wallet')`);
    db.run(`INSERT OR IGNORE INTO transaction_type (id, name, description) VALUES (5, 'loan_debit', 'Loan repayment deducted from the wallet')`);
    db.run(`INSERT OR IGNORE INTO transaction_type (id, name, description) VALUES (6, 'penalty', 'Penalty charged to the wallet')`);
    db.run(`INSERT OR IGNORE INTO transaction_type (id, name, description) VALUES (7, 'account_opening', 'Initial deposit for account opening')`);
}

// Export the database connection for use in other modules  
// Call the function to create tables
module.exports = {db, createTables};