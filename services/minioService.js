import config from "../config/load-config.js";
import { minioClient } from "../config/minio.js";

const checkBucket = async () => {
  const bucketExists = await minioClient.bucketExists(config.MINIO_BUCKET_NAME);
  if (!bucketExists) {
    try {
      await minioClient.makeBucket(config.MINIO_BUCKET_NAME);
    } catch (err) {
      console.log("Error in makeBucket:", err);
    }
  }
};

const uploadFileToMinio = async (req, res) => {
  await checkBucket();

  try {
    const file = req.file; // Access the uploaded file
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const objectName = file.originalname; // Use the original file name for MinIO

    // Upload file to MinIO
    const info = await minioClient.putObject(
      config.MINIO_BUCKET_NAME,
      objectName,
      file.buffer,
      file.size
    );
    console.log(info);
    res.json({ info });
  } catch (err) {
    console.error("Error in uploadFileToMinio:", err);
    return res.status(500).send("Error uploading file");
  }
};

const getFileFromMinio = async (fileName) => {
  await checkBucket();

  try {
    const dataStream = await minioClient.getObject(
      config.MINIO_BUCKET_NAME,
      fileName
    );
    const chunks = [];
    return new Promise((resolve, reject) => {
      dataStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      dataStream.on("end", () => {
        const fileBuffer = Buffer.concat(chunks);
        resolve(fileBuffer);
      });

      dataStream.on("error", (error) => {
        reject(error);
      });
    });
  } catch (err) {
    console.log("Error in getFileFromMinio:", err);
    return [];
  }
};

const getFileURLFromMinio = async (req, res) => {
  await checkBucket();

  try {
    const objectName = req.params.fileName;
    const url = await minioClient.presignedGetObject(
      config.MINIO_BUCKET_NAME,
      objectName,
      7 * 24 * 60 * 60
    );
    res.json({ url }); // Return the URL to the client
  } catch (err) {
    console.log("Error in getFileURLFromMinio:", err);
    return res.status(500).send("Could not generate URL");
  }
};

const removeFileFromMinio = async (fileName) => {
  await checkBucket();

  try {
    await minioClient.removeObject(envs.MINIO_BUCKET_NAME, fileName);
  } catch (err) {
    console.log("Error in removeFileFromMinio:", err);
  }
};

const isFileExistInMinio = async (fileName) => {
  await checkBucket();

  try {
    await minioClient.statObject(bucketName, fileName);
    return true;
  } catch (err) {
    console.log("Error in isFileExistInMinio:", err);
    return false;
  }
};

export {
  uploadFileToMinio,
  getFileURLFromMinio,
  removeFileFromMinio,
  isFileExistInMinio,
  getFileFromMinio,
};
