const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        req.flash('error_msg', 'Too many login/registration attempts. Please try again in 15 minutes.');
        res.redirect('/picpinch/login');
    }
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200, 
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.'
});

module.exports = { authLimiter, generalLimiter };