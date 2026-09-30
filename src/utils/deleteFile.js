const fs = require('fs');
const path = require('path');
const { upload_dir } = require('../config/config');
const deleteFile = async (filename) => {
    if (!filename) return;
    
    const filePath = path.join(upload_dir, filename);

    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    } catch (error) {
        console.error('Error in delete file helper:', error);
    }
};

module.exports = deleteFile;