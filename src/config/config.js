const fs = require('fs');
require('dotenv').config();
const path = require('path');

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const required = ['PORT', 'MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'NODE_ENV', 'SESSION_SECRET', 'REDIS_URI'];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}

module.exports = {
    upload_dir: uploadDir,
    port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    access_secret: process.env.JWT_ACCESS_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    node_env: process.env.NODE_ENV,
    session_secret: process.env.SESSION_SECRET,
    redis_uri: process.env.REDIS_URI
};