const User = require('../models/User');
const bcrypt = require('bcrypt');
const { node_env } = require('../config/config');
const { getAccessToken, getRefreshToken } = require('../utils/tokens');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            req.flash('error_msg', 'All fields are required.');
            return res.redirect('/picpinch/register');
        }

        if (password.length < 6) {
            req.flash('error_msg', 'Password must be at least 6 characters.');
            return res.redirect('/picpinch/register');
        }

        const user = await User.findOne({ email });

        if (user) {
            req.flash('error_msg', 'Email is already in use.');
            return res.redirect('/picpinch/register');
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        req.flash('success_msg', 'Account created successfully! Please log in.');
        res.redirect('/picpinch/login');

    } catch (error) {
        if (error.code === 11000) {
            req.flash('error_msg', 'Email is already in use.');
            return res.redirect('/picpinch/register');
        }

        console.error('Error in register route:', error);
        req.flash('error_msg', 'An unexpected error occurred during registration.');
        res.redirect('/picpinch/register');
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            req.flash('error_msg', 'All fields are required.');
            return res.redirect('/picpinch/login');
        }

        const user = await User.findOne({ email }).select('+password');
        const dummyHash = '$2b$12$c6UzMDM.H6dfI/f/IKcEe01s9zXQz3f9Zt9mB2v7wS9wQ8Bq';

        const isMatch = user
            ? await user.comparePassword(password)
            : await bcrypt.compare(password, dummyHash);

        if (!user || !isMatch) {
            req.flash('error_msg', 'Invalid email or password.');
            return res.redirect('/picpinch/login');
        }

        const accessToken = getAccessToken(user._id);
        const refreshToken = getRefreshToken(user._id);

        const isProduction = node_env === 'production';

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        req.flash('success_msg', `Welcome ${user.name}`);
        res.redirect('/picpinch/');

    } catch (error) {
        console.error('Error in login route:', error);
        req.flash('error_msg', 'An unexpected error occurred during login.');
        res.redirect('/picpinch/login');
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        req.flash('success_msg', 'Logged out successfully.');
        res.redirect('/picpinch/login');
    } catch (error) {
        console.error('Error in logout route:', error);
        res.redirect('/picpinch/login');
    }
};

module.exports = { register, login, logout };