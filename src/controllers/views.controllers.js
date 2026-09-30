const Image = require('../models/Image');
const redis = require('../config/redis');

const getRegister = (req, res) => {
    res.render('auth/register');
};

const getLogin = (req, res) => {
    res.render('auth/login');
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const cacheKey = `user:${userId}:images`;

        const cachedImages = await redis.get(cacheKey);

        let images;
        if (cachedImages) {
            images = JSON.parse(cachedImages);
        } else {
            images = await Image.find({ userId }).lean();
            await redis.set(cacheKey, JSON.stringify(images), 'EX', 3600);
        }

        if (images.length === 0) {
            req.flash('success_msg', 'No photos yet');
        }

        res.render('profile', { images });
    } catch (error) {
        console.error('Error in profile route:', error);
        req.flash('error_msg', 'Failed to load profile.');
        res.redirect('/login');
    }
};

const getPicPinch = async (req, res) => {
    try {
        const userId = req.user._id;
        const cacheKey = `user:${userId}:images`;

        const cachedImages = await redis.get(cacheKey);

        let images;
        if (cachedImages) {
            images = JSON.parse(cachedImages);
        } else {
            images = await Image.find({ userId }).lean();
            await redis.set(cacheKey, JSON.stringify(images), 'EX', 3600);
        }

        res.render('home', { images });
    } catch (error) {
        console.error('Error in home route:', error);
        req.flash('error_msg', 'Failed to load home page.');
        res.redirect('/picpinch/profile');
    }
};

const getImage = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const { id } = req.params;
        const cacheKey = `image:${id}`;

        let image;
        const cachedImage = await redis.get(cacheKey);

        if (cachedImage) {
            image = JSON.parse(cachedImage);
            if (String(image.userId) !== userId) {
                req.flash('error_msg', 'Image not found or unauthorized.');
                return res.redirect('/picpinch/profile');
            }
        } else {
            image = await Image.findOne({ _id: id, userId }).lean();

            if (!image) {
                req.flash('error_msg', 'Image not found or unauthorized.');
                return res.redirect('/picpinch/profile');
            }

            await redis.set(cacheKey, JSON.stringify(image), 'EX', 3600);
        }

        res.render('image', { image });
    } catch (error) {
        console.error('Error in getImage route:', error);
        req.flash('error_msg', 'Failed to retrieve image.');
        res.redirect('/picpinch/profile');
    }
};

module.exports = { 
    getRegister, 
    getLogin, 
    getProfile, 
    getPicPinch, 
    getImage,
};