import { orderModel } from "../models/index.js";

const addOrder = async (printerID = 1) => {
  return await orderModel.addOrder(printerID);
};

const getOrderByPrinterID = async (printerID = 1) => {
  return await orderModel.getOrderByPrinterID(printerID);
};

const updateOrderStatus = async (id = 2, orderStatus = "completed") => {
  return await orderModel.updateOrderStatus(id, orderStatus);
};

const updateOrderCompleteTime = async (id = 2) => {
  return await orderModel.updateOrderCompleteTime(id);
};

const updateOrderStaffID = async (id = 2, staffID = 1) => {
  return await orderModel.updateOrderStaffID(id, staffID);
};

const addPackage = async (
  packageInfo = {
    numOfCopies: 1,
    side: "1",
    colorAllPages: false,
    pagePerSheet: 1,
    paperSize: "A4",
    scale: 1,
    cover: false,
    glass: false,
    binding: false,
    orderID: 2,
  }
) => {
  return await orderModel.addPackage(packageInfo);
};

const addPackagePrintingPages = async (
  printingPages = { packageID: 1, color: false, fromPage: 1, toPage: 100 }
) => {
  return await orderModel.addPackagePrintingPages(printingPages);
};

const getPackageByOrderID = async (orderID = 2) => {
  return await orderModel.getPackageByOrderID(orderID);
};

const getPackagePrintingPagesByPackageID = async (packageID = 1) => {
  return await orderModel.getPackagePrintingPagesByPackageID(packageID);
};

const addFileMetadata = async (
  fileMetadata = {
    fileName: "test",
    size: "10 KB",
    numPages: "100",
    url: "testURL",
    packageID: 5,
  }
) => {
  return await orderModel.addFileMetadata(fileMetadata);
};

const getFileMetadataByPackageID = async (packageID = 5) => {
  return await orderModel.getFileMetadataByPackageID(packageID);
};

const addPaymentLog = async (money = 100000) => {
  return await orderModel.addPaymentLog(money);
};

const addWithdrawLog = async (id = 2) => {
  return await orderModel.addWithdrawLog(id);
};

const addReturnLog = async (id = 3) => {
  return await orderModel.addReturnLog(id);
};

const addMakeOrders = async (
  makeOrders = { customerID: 5, orderID: 5, logID: 5 }
) => {
  return await orderModel.addMakeOrders(makeOrders);
};

const addCancelOrders = async (
  cancelOrders = { customerID: 5, orderID: 5, logID: 5 }
) => {
  return await orderModel.addCancelOrders(cancelOrders);
};

export {
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
  addReturnLog,
  addMakeOrders,
  addCancelOrders,
};
