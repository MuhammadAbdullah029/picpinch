const express = require('express');
const { authLimiter } = require('../middlewares/rateLimit.middleware');
const { register, login, logout } = require('../controllers/auth.controllers');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/logout', logout);

module.exports = router;