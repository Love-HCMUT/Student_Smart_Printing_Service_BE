import dotenv from "dotenv";
dotenv.config();

const config = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  PORT: process.env.PORT,
  // Thêm các biến môi trường khác nếu cần
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
  MINIO_PORT: process.env.MINIO_PORT,
  MINIO_ACCESSKEY: process.env.MINIO_ACCESSKEY,
  MINIO_SECRETKEY: process.env.MINIO_SECRETKEY,
  MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME,
};

export default config;
