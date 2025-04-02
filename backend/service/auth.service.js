const { db } = require("../dbConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v7 } = require("uuid");

module.exports = {
  registerUser: async (req, res) => {
    const { username, password, firstName, lastName, email } = req.body;

    if (!username || !password || !firstName || !lastName || !email) {
      return res
        .status(400)
        .json({ error: "Incomplete data error" });
    }

    try {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        db.get(
          "SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)",
          [username, email],
          (err, row) => {
            if (err) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: err.message });
            }
            if (row) {
              db.run("ROLLBACK");
              return res
            .status(400)
            .json({ error: "Username / Email already exists" });
            }

            // Hash the password
            const hashedPassword = bcrypt.hashSync(password, 10);

            // Insert new user into the database
            db.run(
              "INSERT INTO users (username, password, first_name, last_name, email, role_id) VALUES (?, ?, ?, ?, ?, ?)",
              [username, hashedPassword, firstName, lastName, email, 2],
              function(err) {
            if (err) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: err.message });
            }

            // Perform additional transaction or logic here
            const userId = this.lastID; // Get the ID of the newly inserted user
            console.log(`User inserted with ID: ${userId}`);

            // Example: Insert into another table or perform another action
            db.run(
              "INSERT INTO wallet (user_id, balance) VALUES (?, ?)",
              [userId, 500],
              function (wallErr) {
                if (wallErr) {
                  db.run("ROLLBACK");
                  return res.status(500).json({ error: wallErr.message });
                }
                const walletId = this.lastID;
                db.run(
                  "INSERT INTO transactions  (wallet_id, transaction_type_id, amount, description, reff) VALUES(?,?,?,?,?)",
                  [walletId, 7, 500, "Account Opening", v7()],
                  (transError) => {
                if (transError) {
                  db.run("ROLLBACK");
                  return res
                    .status(500)
                    .json({ error: transError.message });
                }

                // Commit the transaction
                db.run("COMMIT", (commitErr) => {
                  if (commitErr) {
                    db.run("ROLLBACK");
                    return res
                      .status(500)
                      .json({ error: commitErr.message });
                  }

                  res
                    .status(201)
                    .json({ message: "User registered successfully", status: 1 });
                });
                  }
                );
              }
            );
              }
            );
          }
        );
      });
    } catch (error) {
      console.log(error);
    }

  },

  login: (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Check if the user exists
    db.get(
      "SELECT * FROM users WHERE LOWER(username) = LOWER(?)",
      [username],
      (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user)
          return res
            .status(400)
            .json({ error: "Invalid username or password" });
        // Compare the password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid)
          return res
            .status(400)
            .json({ error: "Invalid username or password" });
        // Generate a JWT token
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            role: user.role_id,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION || "1h" }
        );
        // Send the token to the client
        res.json({ message: "Login successful", token });
      }
    );
  },
};
