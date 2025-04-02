const {db} = require('../dbConfig');
module.exports = {
    getAllUsers: (req,res) => {
        db.all('SELECT id, first_name, last_name, username, email, password, role_id FROM users', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    },
    getUserDashboard: (req, res) => {
        const user = req.user;
        const result = {balance: 0, transaction: {}};
       
        db.get(`select id, balance, created_at from wallet where user_id = ?`,[user.id], (err, walletRow) => {
            if (err) return res.status(500).json({error: err.message});
            if (walletRow) {
                result.balance = walletRow.balance;
                db.get(`
                    SELECT t.transaction_type_id, tt.name AS transaction_type_name, t.description, t.reff, t.amount, t.created_at 
                    FROM transactions t
                    JOIN transaction_type tt ON t.transaction_type_id = tt.id
                    WHERE t.wallet_id = ? order by t.created_at desc
                `, [walletRow.id], (err, transactionRow) => {
                    if (err) return res.status(500).json({ error: err.message });
                    if (transactionRow) {
                        result.transaction = transactionRow;
                    }
                    res.json(result);
                });
            }
        });
    },

    getUserHistory: (req, res) => {
        const user = req.user;
        const result = {balance: 0, transaction: []};
       
        db.get(`select id, balance, created_at from wallet where user_id = ?`,[user.id], (err, walletRow) => {
            if (err) return res.status(500).json({error: err.message});
            if (walletRow) {
                result.balance = walletRow.balance;
                db.all(`
                    SELECT t.transaction_type_id, tt.name AS transaction_type_name, t.description, t.reff, t.amount, t.created_at 
                    FROM transactions t
                    JOIN transaction_type tt ON t.transaction_type_id = tt.id
                    WHERE t.wallet_id = ? order by t.created_at desc
                `, [walletRow.id], (err, transactionRow) => {
                    if (err) return res.status(500).json({ error: err.message });
                    if (transactionRow) {
                        result.transaction = transactionRow;
                    }
                    res.json(result);
                });
            }
        });
    },

    getAllBeneficiries: (req, res)=> {
        const user = req.user;
        db.all(`select id as 'value', username as 'label' from users where role_id != 1 and id != ?`,[user.id],(err, users) => {
            if (err) return res.status(500).json({error: err.message});
            if (users) {
                res.json(users)
            }
        })
    }
}