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

const uploadFileToMinio = async (file, minioName) => {
  try {
    try {
      await checkBucket();
    } catch (err) {
      console.log("Error in checkBucket", err);
    }
    const info = await minioClient.putObject(
      config.MINIO_BUCKET_NAME,
      minioName,
      file.buffer,
      file.size
    );
    return info;
  } catch (err) {
    console.error("Error in uploadFileToMinio:", err);
    return [];
  }
};

const getFileFromMinio = async (req, res) => {
  // try {
  //   const fileName = req.body.fileName;
  //   const dataStream = await minioClient.getObject(
  //     config.MINIO_BUCKET_NAME,
  //     fileName
  //   );
  //   const chunks = [];
  //   return new Promise((resolve, reject) => {
  //     dataStream.on("data", (chunk) => {
  //       chunks.push(chunk);
  //     });

  //     dataStream.on("end", () => {
  //       const fileBuffer = Buffer.concat(chunks);
  //       resolve(fileBuffer);
  //     });
  //     dataStream.on("error", (error) => {
  //       reject(error);
  //     });
  //   }).then((data) => res.json(data));
  // } catch (err) {
  //   console.log("Error in getFileFromMinio:", err);
  //   return [];
  // }
  const { fileName } = req.params;
  const bucketName = config.MINIO_BUCKET_NAME;
  try {
    try {
      await checkBucket();
    } catch (err) {
      console.log("Error in checkBucket", err);
    }
    // Fetch the file from MinIO
    const fileStream = await minioClient.getObject(bucketName, fileName);

    // Set headers for the file response
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    // Pipe the MinIO file stream to the response
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error fetching file from MinIO:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch file", error: error.message });
  }
};

const getFileURLFromMinio = async (fileName) => {
  try {
    try {
      await checkBucket();
    } catch (err) {
      console.log("Error in checkBucket", err);
    }
    const url = await minioClient.presignedGetObject(
      config.MINIO_BUCKET_NAME,
      fileName,
      7 * 24 * 60 * 60
    );
    return url;
  } catch (err) {
    console.log("Error in getFileURLFromMinio:", err);
    return [];
  }
};

const removeFileFromMinio = async (fileName) => {
  try {
    try {
      await checkBucket();
    } catch (err) {
      console.log("Error in checkBucket", err);
    }
    await minioClient.removeObject(envs.MINIO_BUCKET_NAME, fileName);
  } catch (err) {
    console.log("Error in removeFileFromMinio:", err);
  }
};

const isFileExistInMinio = async (fileName) => {
  try {
    try {
      await checkBucket();
    } catch (err) {
      console.log("Error in checkBucket", err);
    }
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
