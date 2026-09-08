const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        maxlength: [6, 'Password must be at least 6 characters'],
        select: false
    }
}, { timestamps: true });

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword =  async function (plainPassword){
    return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);