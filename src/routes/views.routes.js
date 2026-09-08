const express = require('express');
const protected = require('../middlewares/auth.middleware');
const { generalLimiter } = require('../middlewares/rateLimit.middleware');
const { getRegister, getLogin, getProfile, getPicPinch, getImage } = require('../controllers/views.controllers');

const router = express.Router();

router.get('/login', getLogin);
router.get('/register', getRegister);
router.get('/', protected, generalLimiter, getPicPinch);
router.get('/profile', protected, generalLimiter, getProfile);
router.get('/image/:id', protected, generalLimiter, getImage);


module.exports = router;