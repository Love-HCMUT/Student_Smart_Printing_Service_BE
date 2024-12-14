import bcrypt from "bcrypt";
import { orderModel } from "../models/index.js";

const SALT_ROUNDS = 10;

const addOrder = async (printerID = 1) => {
  try {
    return await orderModel.addOrder(printerID);
  } catch (err) {
    throw err;
  }
};

const getOrderByPrinterID = async (printerID = 1) => {
  try {
    return await orderModel.getOrderByPrinterID(printerID);
  } catch (err) {
    throw err;
  }
};

const updateOrderStatus = async (id = 2, orderStatus = "completed") => {
  try {
    return await orderModel.updateOrderStatus(id, orderStatus);
  } catch (err) {
    throw err;
  }
};

const updateOrderCompleteTime = async (id = 2) => {
  try {
    return await orderModel.updateOrderCompleteTime(id);
  } catch (err) {
    throw err;
  }
};

const updateOrderStaffID = async (id = 2, staffID = 1) => {
  try {
    return await orderModel.updateOrderStaffID(id, staffID);
  } catch (err) {
    throw err;
  }
};

const addPackage = async (
  packageInfo = {
    numOfCopies: 1,
    side: "1",
    colorAllPages: false,
    colorCover: false,
    pagePerSheet: 1,
    paperSize: "A4",
    scale: 1,
    cover: false,
    glass: false,
    binding: false,
    orderID: 2,
  }
) => {
  try {
    return await orderModel.addPackage(packageInfo);
  } catch (err) {
    throw err;
  }
};

const addPackagePrintingPages = async (
  printingPages = {
    packageID: 1,
    color: false,
    fromPage: 1,
    toPage: 100,
    orientation: "landscape",
  }
) => {
  try {
    return await orderModel.addPackagePrintingPages(printingPages);
  } catch (err) {
    throw err;
  }
};

const getPackageByOrderID = async (orderID = 2) => {
  try {
    return await orderModel.getPackageByOrderID(orderID);
  } catch (err) {
    throw err;
  }
};

const getPackagePrintingPagesByPackageID = async (packageID = 1) => {
  try {
    return await orderModel.getPackagePrintingPagesByPackageID(packageID);
  } catch (err) {
    throw err;
  }
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
  try {
    return await orderModel.addFileMetadata(fileMetadata);
  } catch (err) {
    throw err;
  }
};

const getFileMetadataByPackageID = async (packageID = 5) => {
  try {
    return await orderModel.getFileMetadataByPackageID(packageID);
  } catch (err) {
    throw err;
  }
};

const addPaymentLog = async (money = 100000) => {
  try {
    return await orderModel.addPaymentLog(money);
  } catch (err) {
    throw err;
  }
};

const addWithdrawLog = async (id = 2) => {
  try {
    return await orderModel.addWithdrawLog(id);
  } catch (err) {
    throw err;
  }
};

const addReturnLog = async (id = 3) => {
  try {
    return await orderModel.addReturnLog(id);
  } catch (err) {
    throw err;
  }
};

const addMakeOrders = async (
  makeOrders = { customerID: 5, orderID: 5, logID: 5, note: "test" }
) => {
  try {
    return await orderModel.addMakeOrders(makeOrders);
  } catch (err) {
    throw err;
  }
};

const addCancelOrders = async (
  cancelOrders = { customerID: 5, orderID: 5, logID: 5 }
) => {
  try {
    return await orderModel.addCancelOrders(cancelOrders);
  } catch (err) {
    throw err;
  }
};

const addDeclineOrders = async (
  declineOrders = { staffID: 5, orderID: 5, logID: 5, note: "Decline order" }
) => {
  try {
    return await orderModel.addDeclineOrders(declineOrders);
  } catch (err) {
    throw err;
  }
};

const getAllActivePrinter = async (
  condition = {
    colorPrinting: true,
    side: "2",
  }
) => {
  try {
    const printers = await orderModel.getAllActivePrinter(condition);
    const res = await Promise.all(
      printers.map(async (printer) => {
        const orders = await orderModel.getOrderByPrinterID(printer.id);
        printer.requests = orders.length;
        return printer;
      })
    );
    return res;
  } catch (err) {
    console.log("Error in orderService - getAllActivePrinter:", err);
    throw new Error(`Error in orderService - getAllActivePrinter: ${err}`);
  }
};

const getCustomer = async (customerID = 2) => {
  try {
    return await orderModel.getCustomer(customerID);
  } catch (err) {
    throw err;
  }
};

const generateMinioName = async (originalName) => {
  const lastPeriodIndex = originalName.lastIndexOf(".");
  if (lastPeriodIndex === -1) {
    return `${originalName}-${"error"}.txt`;
  }

  const fileExtension = originalName.slice(lastPeriodIndex);
  const baseFileName = originalName.slice(0, lastPeriodIndex);

  const timestamp = new Date().getTime().toString();
  const combinedString = `${baseFileName}${timestamp}`;
  const hash = bcrypt.hashSync(combinedString, SALT_ROUNDS);

  const uniqueFileName = `${hash}${fileExtension}`;

  return uniqueFileName.replace(/\//g, ".");
};

const getPrinterByStaffID = async (staffID = 1) => {
  try {
    return await orderModel.getPrinterByStaffID(staffID);
  } catch (err) {
    throw err;
  }
};

const decreaseCustomerBalance = async (customerID = 1, amount = 0) => {
  try {
    return await orderModel.decreaseCustomerBalance(customerID, amount);
  } catch (err) {
    throw err;
  }
};

const increaseCustomerBalance = async (customerID = 1, amount = 0) => {
  try {
    return await orderModel.increaseCustomerBalance(customerID, amount);
  } catch (err) {
    throw err;
  }
};

const getOrderCost = async (orderID = 1) => {
  try {
    return await orderModel.getOrderCost(orderID);
  } catch (err) {
    throw err;
  }
};

const addPrintingLog = async (
  printingLog = { orderID: 1, logNumber: 1, fileID: 10 }
) => {
  try {
    return await orderModel.addPrintingLog(printingLog);
  } catch (err) {
    throw err;
  }
};

const updatePrintingLogEndTime = async (fileID) => {
  try {
    return await orderModel.updatePrintingLogEndTime(fileID);
  } catch (err) {
    throw err;
  }
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
  addDeclineOrders,
  getAllActivePrinter,
  getCustomer,
  generateMinioName,
  getPrinterByStaffID,
  decreaseCustomerBalance,
  increaseCustomerBalance,
  getOrderCost,
  addPrintingLog,
  updatePrintingLogEndTime,
};
