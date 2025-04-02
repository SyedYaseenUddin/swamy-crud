const { db } = require("../dbConfig");
const { v7 } = require("uuid");

const runQuery = (operations, res, rej) => {
  if (!operations?.length) {
    res();
  } else {
    const operation = operations.shift();
    db.run(operation.sql, operation.params, (err) => {
      if (err) {
        return rej(err);
      }
      runQuery(operations, res, rej);
    });
  }
};

const runBatchProcess = (operations) => {
  return new Promise((resolve, reject) => {
    runQuery(operations, resolve, reject);
  });
};

module.exports = {
  fundTransfer: (req, res) => {
    const reffId = v7();
    const user = req.user;
    const { amount, beneficiary } = req.body;

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      db.get(
        `SELECT balance, id FROM wallet WHERE user_id = ?`,
        [user.id],
        (err, wallet) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          if (!wallet || wallet.balance < amount) {
            return res.status(402).json({ error: "Insufficient balance" });
          }

          db.get(
            `SELECT (SELECT username FROM users WHERE id = ?) AS 'accHolder', 
                                    (SELECT username FROM users WHERE id = ?) AS 'beneficiaryUser', 
                                    (SELECT id FROM wallet WHERE user_id = ?) AS 'bWalletId' 
                            FROM users LIMIT 1`,
            [user.id, +beneficiary, +beneficiary],
            (err, { accHolder, beneficiaryUser, bWalletId }) => {
              if (err) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: err.message });
              }
              if (!accHolder || !beneficiaryUser || !bWalletId) {
                db.run("ROLLBACK");
                return res
                  .status(400)
                  .json({ error: "Invalid beneficiary details" });
              }
              const betchQueries = [
                {
                  sql: `INSERT INTO transactions (wallet_id, transaction_type_id, amount, description, reff) VALUES (?, ?, ?, ?, ?)`,
                  params: [
                    wallet.id,
                    2,
                    -amount,
                    `Amount transferred to ${beneficiaryUser}`,
                    reffId,
                  ],
                },
                {
                  sql: `INSERT INTO transactions (wallet_id, transaction_type_id, amount, description, reff) VALUES (?, ?, ?, ?, ?)`,
                  params: [
                    bWalletId,
                    1,
                    amount,
                    `Amount received from ${accHolder}`,
                    reffId,
                  ],
                },
                {
                  sql: `UPDATE wallet SET balance = balance - ? WHERE id = ?`,
                  params: [amount, wallet.id],
                },
                {
                  sql: `UPDATE wallet SET balance = balance + ? WHERE id = ?`,
                  params: [amount, bWalletId],
                },
              ];
              runBatchProcess(betchQueries)
                .then(() => {
                  db.run("COMMIT", (commitErr) => {
                    if (commitErr) {
                      db.run("ROLLBACK");
                      return res.status(500).json({ error: commitErr.message });
                    }

                    res
                      .status(201)
                      .json({
                        message: "User registered successfully",
                        status: 1,
                      });
                  });
                })
                .catch((err) => {
                  db.run("ROLLBACK");
                  return res.status(500).json({ error: err.message });
                });
            }
          );
        }
      );
    });
  },
};
