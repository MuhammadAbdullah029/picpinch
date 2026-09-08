const multer = require('multer');

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 20 * 1024 * 1024 // 20 MB limit
    },
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, PNG, and WebP images are allowed.'));
        }
    }
});

module.exports = upload;