import dotenv from 'dotenv'
dotenv.config()

const config = {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    PORT: process.env.PORT || 3000,
    REDIS_URI: process.env.REDIS_URI
    // Thêm các biến môi trường khác nếu cần
};

export default config;