import dotenv from "dotenv";
dotenv.config();

const config = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  PORT: process.env.PORT || 3000,
  REDIS_URI: process.env.REDIS_URI,

  MOMO_ACCESS_KEY: process.env.MOMO_ACCESS_KEY,
  MOMO_SECRET_KEY: process.env.MOMO_SECRET_KEY,
  MOMO_REDIRECT_URL: process.env.MOMO_REDIRECT_URL,
  MOMO_IPN_URL: process.env.MOMO_IPN_URL,
  MOMO_GATEWAY_URL: process.env.MOMO_GATEWAY_URL,
  // Thêm các biến môi trường khác nếu cần
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
  MINIO_PORT: process.env.MINIO_PORT,
  MINIO_ACCESSKEY: process.env.MINIO_ACCESSKEY,
  MINIO_SECRETKEY: process.env.MINIO_SECRETKEY,
  MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME,
};

export default config;
