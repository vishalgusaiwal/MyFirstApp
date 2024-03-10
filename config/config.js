const config = {
    env: process.env.NODE_DEV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "MY_Secret_key",
    mongoUri: "mongodb+srv://vishalgusaiwal58:VGatPdP1CkUqje2z@mern.9rspxdx.mongodb.net/?retryWrites=true&w=majority&appName=Mern"/*process.env.MONGODB_URI || process.env.MONGO_HOST || 'mongodb://' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/projectmern'*/
};

export default config;