// handle data from database
import { minioService, orderService } from "../services/index.js";

const uploadFileToMinio = (req, res) => {
  minioService.uploadFileToMinio(req, res);
};

const addOrder = async (req, res) => {
  res.json(await orderService.addOrder(req.params.printerID));
};

const getOrderByPrinterID = async (req, res) => {
  res.json(await orderService.getOrderByPrinterID(req.params.printerID));
};

const updateOrderStatus = async (req, res) => {
  res.json(
    await orderService.updateOrderStatus(req.params.id, req.params.status)
  );
};

export { uploadFileToMinio, addOrder, getOrderByPrinterID, updateOrderStatus };
