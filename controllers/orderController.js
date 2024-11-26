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
  res.json(await orderService.updateOrderStatus(req.body.id, req.body.status));
};

const updateOrderCompleteTime = async (req, res) => {
  res.json(await orderService.updateOrderCompleteTime(req.body.id));
};

const updateOrderStaffID = async (req, res) => {
  res.json(
    await orderService.updateOrderStaffID(req.body.id, req.body.staffID)
  );
};

const addPackage = async (req, res) => {
  res.json(await orderService.addPackage(req.body));
};

const addPackagePrintingPages = async (req, res) => {
  res.json(await orderService.addPackagePrintingPages(req.body));
};

export {
  uploadFileToMinio,
  addOrder,
  getOrderByPrinterID,
  updateOrderStatus,
  updateOrderCompleteTime,
  updateOrderStaffID,
  addPackage,
  addPackagePrintingPages,
};
