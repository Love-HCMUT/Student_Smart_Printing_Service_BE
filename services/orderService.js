import bcrypt from "bcrypt";
import { orderModel } from "../models/index.js";

const SALT_ROUNDS = 10;

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
  return await orderModel.addPackage(packageInfo);
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
  makeOrders = { customerID: 5, orderID: 5, logID: 5, note: "test" }
) => {
  return await orderModel.addMakeOrders(makeOrders);
};

const addCancelOrders = async (
  cancelOrders = { customerID: 5, orderID: 5, logID: 5 }
) => {
  return await orderModel.addCancelOrders(cancelOrders);
};

const addDeclineOrders = async (
  declineOrders = { staffID: 5, orderID: 5, logID: 5 }
) => {
  return await orderModel.addDeclineOrders(declineOrders);
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
    return [];
  }
};

const getCustomer = async (customerID = 2) => {
  return await orderModel.getCustomer(customerID);
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
  return await orderModel.getPrinterByStaffID(staffID);
};

const decreaseCustomerBalance = async (customerID = 1, amount = 0) => {
  return await orderModel.decreaseCustomerBalance(customerID, amount);
};

const increaseCustomerBalance = async (customerID = 1, amount = 0) => {
  return await orderModel.increaseCustomerBalance(customerID, amount);
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
};
