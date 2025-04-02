const authController = require('./controllers/auth.controller');
const userController = require('./controllers/user.controller');
const transactionController = require('./controllers/transaction.controller');
const {authenticateToken} = require('./authorization');

module.exports = (app) => {
    app.use('/auth', authController);
    app.use('/api/user', authenticateToken, userController);
    app.use('/api/transaction', authenticateToken, transactionController);
}