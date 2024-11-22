import config from "../config/load-config.js";
import { minioClient } from "../config/minio.js";

const uploadFileToMinio = async (req, res) => {
  try {
    const file = req.file; // Access the uploaded file
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const objectName = file.originalname; // Use the original file name for MinIO

    // Upload file to MinIO
    minioClient.putObject(
      config.MINIO_BUCKET_NAME,
      objectName,
      file.buffer,
      file.size,
      (err, info) => {
        if (err) {
          console.error("Error in uploadFileToMinio:", err);
          return res.status(500).send("Error uploading file");
        }
        // res.send("File uploaded successfully");
      }
    );
  } catch (err) {
    console.error("Error in uploadFileToMinio:", err);
  }
};

const getFileURLFromMinio = async (req, res) => {
  try {
    const objectName = req.params.fileName;
    const url = await minioClient.presignedGetObject(
      config.MINIO_BUCKET_NAME,
      objectName,
      30 * 24 * 60 * 60
    );
    res.json({ url }); // Return the URL to the client
  } catch (err) {
    console.error("Error in getFileURLFromMinio:", err);
    return res.status(500).send("Could not generate URL");
  }
};

const removeFileFromMinio = async (req, res) => {
  try {
    await minioClient.removeObject(envs.MINIO_BUCKET_NAME, req.params.fileName);
  } catch (error) {
    console.error("Error in removeFileFromMinio:", err);
  }
};

const isFileExistInMinio = async (req, res) => {
  try {
    await minioClient.statObject(bucketName, req.params.fileName);
    return true;
  } catch (err) {
    console.error("Error in isFileExistInMinio:", err);
    return false;
  }
};

export { uploadFileToMinio };
