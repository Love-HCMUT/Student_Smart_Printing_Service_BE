import * as Minio from "minio";
import config from "./load-config.js";

const minioClient = new Minio.Client({
  endPoint: config.MINIO_ENDPOINT,
  port: Number(config.MINIO_PORT),
  accessKey: config.MINIO_ACCESSKEY,
  secretKey: config.MINIO_SECRETKEY,
  useSSL: false,
});

export { minioClient };
