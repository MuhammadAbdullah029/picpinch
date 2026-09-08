const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
    savedPercent: Number,
    url: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);