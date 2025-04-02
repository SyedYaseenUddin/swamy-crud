const jwt = require('jsonwebtoken');



// Authentication middleware
const authenticateToken = (req, res, next) => { 
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({error: err.message});
        req.user = user;
        next();
    });
};

// Role Authentication
const hasRoles = (...roles) => {
    return (req, res, next) => {
        const role = req?.user?.role;
        if (role && roles.includes(role)) {
            next();
            return;
        }
        res.status(403).json({error: 'User has no access'});
    }
}

module.exports = {authenticateToken, hasRoles};