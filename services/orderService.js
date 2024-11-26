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
};
