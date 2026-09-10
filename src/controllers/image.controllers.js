const compress = require('../middlewares/compress.middleware');
const Image = require('../models/Image');
const path = require('path');
const redis = require('../config/redis');

const compressImage = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            req.flash('error_msg', 'Please select an image file to upload.');
            return res.redirect('/picpinch/');
        }

        const image = await compress(file);

        const originalSize = file.size;
        const compressedSize = image.compressedImage.size;

        const savedPercent = originalSize > 0 
            ? Math.max(0, parseInt(100 - (compressedSize / originalSize * 100), 10)) 
            : 0;

        const url = path.relative(process.cwd(), image.outputPath).replace(/\\/g, '/');
        
        const userId = req.user._id;

        const compressedImage = await Image.create({
            userId,
            url,
            savedPercent
        });

        if (userId) {
            await redis.del(`user:${userId}:images`);
        }

        req.flash('success_msg', 'Image successfully compressed!');
        res.redirect(`/picpinch/image/${compressedImage._id}`);

    } catch (error) {
        console.error('Error in compress route:', error);
        req.flash('error_msg', 'Failed to compress the image. Please try again.');
        res.redirect('/picpinch/');
    }
};

module.exports = { compressImage };