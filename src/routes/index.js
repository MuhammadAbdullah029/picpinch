const express = require('express');
const authRoutes = require('./auth.routes');
const imageRoutes = require('./image.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/image', imageRoutes);

module.exports = router;