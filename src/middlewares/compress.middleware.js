const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

const { upload_dir } = require('../config/config');

const compress = async (file) => {
    try {
        const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
        const randomHash = crypto.randomBytes(4).toString('hex');
        const uniqueName = `compressed-${Date.now()}-${randomHash}${ext}`;
        
        const outputPath = path.join(upload_dir, uniqueName);

        let pipeline = sharp(file.buffer);

        if (ext === '.png') {
            pipeline = pipeline.png({ compressionLevel: 8, quality: 75 });
        } else if (ext === '.webp') {
            pipeline = pipeline.webp({ quality: 70 });
        } else {
            pipeline = pipeline.jpeg({ quality: 70, mozjpeg: true, progressive: true });
        }

        const compressedImage = await pipeline.toFile(outputPath);

        return { 
            compressedImage, 
            outputPath, 
            filename: uniqueName 
        };
    } catch (error) {
        console.error('Error in compress middleware:', error);
        throw error;
    }
};

module.exports = compress;