const jwt = require('jsonwebtoken');
const { access_secret, refresh_secret } = require('../config/config');


const getAccessToken = (userId) =>{
    return jwt.sign({
        id: userId
    }, access_secret ,{ expiresIn: '15m' })
}

const getRefreshToken = (userId) =>{
    return jwt.sign({
        id: userId
    }, refresh_secret ,{ expiresIn: '7d' })
}

module.exports = { getAccessToken, getRefreshToken }; 