const mongoose = require('mongoose');
const { mongo_uri } = require('./config');


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongo_uri);
        console.log(`Database connected successfully: ${conn.connection.host}`);
        
    } catch (error) {
        console.error('Fail to connect with database: ', error); 
        throw error;
    }
}


module.exports = connectDB;