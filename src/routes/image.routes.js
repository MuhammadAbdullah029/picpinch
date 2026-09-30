const express = require('express');
const upload = require('../middlewares/upload.middleware');
const protected = require('../middlewares/auth.middleware');
const { compressImage, deleteImage } = require('../controllers/image.controllers');

const router = express.Router();

router.post('/compress',  protected, upload.single('image'), compressImage);
router.post('/delete/:id', protected, deleteImage);

module.exports = router;