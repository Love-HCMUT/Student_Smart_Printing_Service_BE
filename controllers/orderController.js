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

const getPackageByOrderID = async (req, res) => {
  res.json(await orderService.getPackageByOrderID(req.body.orderID));
};

const getPackagePrintingPagesByPackageID = async (req, res) => {
  res.json(
    await orderService.getPackagePrintingPagesByPackageID(req.body.packageID)
  );
};

const addFileMetadata = async (req, res) => {
  res.json(await orderService.addFileMetadata(req.body));
};

const getFileMetadataByPackageID = async (req, res) => {
  res.json(await orderService.getFileMetadataByPackageID(req.body.packageID));
};

const addPaymentLog = async (req, res) => {
  res.json(await orderService.addPaymentLog(req.body.money));
};

const addWithdrawLog = async (req, res) => {
  res.json(await orderService.addWithdrawLog(req.body.id));
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
  getPackagePrintingPagesByPackageID,
  getPackageByOrderID,
  addFileMetadata,
  getFileMetadataByPackageID,
  addPaymentLog,
  addWithdrawLog,
};
