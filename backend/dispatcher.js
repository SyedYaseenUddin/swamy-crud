const authController = require('./controllers/auth.controller');
const userController = require('./controllers/user.controller');

module.exports = (app) => {
    app.use('/auth', authController);
    app.use('/api/user', userController);
}