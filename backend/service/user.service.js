const {db} = require('../dbConfig');
module.exports = {
    getAllUsers: (req,res) => {
        db.all('SELECT id, username, password FROM users', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
}