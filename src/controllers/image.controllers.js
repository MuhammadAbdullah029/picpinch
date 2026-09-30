const path = require('path');
const Image = require('../models/Image');
const redis = require('../config/redis');
const deleteFile = require('../utils/deleteFile');
const compress = require('../middlewares/compress.middleware');

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

const deleteImage = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        
        const image = await Image.findOneAndDelete({ _id: id, userId });
        
        if (!image) {
            req.flash('error_msg', 'Image not found or unauthorized.');
            return res.redirect('/picpinch/profile');
        }
        
        const filename = image.url.split('/').pop();
        
        await deleteFile(filename);

        await Promise.all([
            redis.del(`image:${id}`),
            redis.del(`user:${userId}:images`)
        ]);

        req.flash('success_msg', 'Image deleted successfully');
        res.redirect('/picpinch/profile');
    } catch (error) {
        console.error('Error in deleteImage route:', error);
        req.flash('error_msg', 'Failed to delete image.');
        res.redirect('/picpinch/profile');
    }
};


module.exports = { compressImage, deleteImage };