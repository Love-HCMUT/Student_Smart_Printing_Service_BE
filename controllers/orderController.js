// handle data from database
import { minioService, orderService } from "../services/index.js";

const uploadFileToMinio = (req, res) => {
  minioService.uploadFileToMinio(req, res);
};

const addOrder = async (req, res) => {
  const { printerID } = req.body;
  res.json(await orderService.addOrder(printerID));
};

const getOrder = async (req, res) => {
  res.json(await orderService.getOrder(req.params.printerID));
};

export { uploadFileToMinio, addOrder, getOrder };
