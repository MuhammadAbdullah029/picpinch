const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const compress = async (file) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const randomHash = crypto.randomBytes(4).toString('hex');
    const uniqueName = `compressed-${Date.now()}-${randomHash}${ext}`;
    
    const outputPath = path.join(uploadDir, uniqueName);

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
};

module.exports = compress;