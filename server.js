const app = require("./src/app");
const { port } = require("./src/config/config");
const connectDB = require("./src/config/db");

const start = async () => {

    try {

        await connectDB();

        app.listen(port, () => {
            console.log(`PicPinch server is running on port: ${port}`);

        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1); 
    }
};

start();