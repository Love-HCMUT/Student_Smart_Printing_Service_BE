import dbs from "../config/mysql-dbs.js";

const addOrder = async (printerID) => {
  try {
    const orderStatus = "Pending";
    const orderDate = new Date();
    const res = await dbs
      .promise()
      .query(`CALL addOrder(?, ?, ?);`, [orderStatus, orderDate, printerID]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in addOrder:", err);
    return [];
  }
};

const getOrderByPrinterID = async (printerID) => {
  try {
    const res = await dbs
      .promise()
      .query(`CALL getOrderByPrinterID(?)`, [printerID]);
    return res[0][0];
  } catch (err) {
    console.log("Error in getOrderByPrinterID:", err);
    return [];
  }
};

const updateOrderStatus = async (id, orderStatus) => {
  try {
    const res = await dbs
      .promise()
      .query(`CALL updateOrderStatus(?, ?)`, [id, orderStatus]);
    return res[0];
  } catch (err) {
    console.log("Error in updateOrderStatus:", err);
    return [];
  }
};

const updateOrderCompleteTime = async (id) => {
  try {
    const res = await dbs
      .promise()
      .query(`CALL updateOrderCompleteTime(?)`, [id]);
    return res[0];
  } catch (err) {
    console.log("Error in updateOrderCompleteTime:", err);
    return [];
  }
};

const updateOrderStaffID = async (id, staffID) => {
  try {
    const res = await dbs
      .promise()
      .query(`CALL updateOrderStaffID(?, ?)`, [id, staffID]);
    return res[0];
  } catch (err) {
    console.log("Error in updateOrderStaffID:", err);
    return [];
  }
};

const addPackage = async (packageInfo) => {
  try {
    const {
      numOfCopies,
      side,
      colorAllPages,
      colorCover,
      pagePerSheet,
      paperSize,
      scale,
      cover,
      glass,
      binding,
      orderID,
    } = packageInfo;
    const res = await dbs
      .promise()
      .query(`CALL addPackage(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        numOfCopies,
        side,
        colorAllPages,
        pagePerSheet,
        paperSize,
        scale,
        cover,
        glass,
        binding,
        orderID,
        colorCover,
      ]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in addPackage:", err);
    return [];
  }
};

const getPackageByOrderID = async (orderID) => {
  try {
    const res = await dbs
      .promise()
      .query(`CALL getPackageByOrderID(?)`, [orderID]);
    return res[0][0];
  } catch (err) {
    console.log("Error in getPackagePrintingPagesByPackageID:", err);
    return [];
  }
};

const addPackagePrintingPages = async (printingPages) => {
  try {
    const { packageID, color, fromPage, toPage, orientation } = printingPages;
    const res = await dbs
      .promise()
      .query(`CALL addPackagePrintingPages(?, ?, ?, ?, ?)`, [
        packageID,
        color,
        fromPage,
        toPage,
        orientation,
      ]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in addPackagePrintingPages:", err);
    return [];
  }
};

const getPackagePrintingPagesByPackageID = async (packageID) => {
  try {
    const res = await dbs
      .promise()
      .query(`CALL getPackagePrintingPagesByPackageID(?)`, [packageID]);
    return res[0][0];
  } catch (err) {
    console.log("Error in getPackagePrintingPagesByPackageID:", err);
    return [];
  }
};

const addFileMetadata = async (fileMetadata) => {
  try {
    const { fileName, size, numPages, url, packageID } = fileMetadata;
    const res = await dbs
      .promise()
      .query(`CALL addFileMetadata(?, ?, ?, ?, ?)`, [
        Buffer.from(fileName, "utf8").toString("utf8"),
        size,
        numPages,
        url,
        packageID,
      ]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in addFileMetadata:", err);
    return [];
  }
};

const getFileMetadataByPackageID = async (packageID) => {
  try {
    const res = await dbs
      .promise()
      .query(`CALL getFileMetadataByPackageID(?)`, [packageID]);
    return res[0];
  } catch (err) {
    console.log("Error in getFileMetadataByPackageID:", err);
    return [];
  }
};

const addPaymentLog = async (money) => {
  try {
    const paymentTime = new Date();
    const res = await dbs
      .promise()
      .query(`CALL addPaymentLog(?, ?)`, [paymentTime, money]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in addPaymentLog:", err);
    return [];
  }
};

const addWithdrawLog = async (id) => {
  try {
    const res = await dbs.promise().query(`CALL addWithdrawLog(?)`, [id]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in addWithdrawLog:", err);
    return [];
  }
};

const addReturnLog = async (id) => {
  try {
    const res = await dbs.promise().query(`CALL addReturnLog(?)`, [id]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in addReturnLog:", err);
    return [];
  }
};

const addMakeOrders = async (makeOrders) => {
  const { customerID, orderID, logID, note } = makeOrders;
  try {
    const res = await dbs
      .promise()
      .query(`CALL addMakeOrders(?, ?, ?, ?)`, [
        customerID,
        orderID,
        logID,
        note,
      ]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in addMakeOrders:", err);
    return [];
  }
};

const addCancelOrders = async (cancelOrders) => {
  const { customerID, orderID, logID, note } = cancelOrders;
  try {
    const res = await dbs
      .promise()
      .query(`CALL addCancelOrders(?, ?, ?, ?)`, [
        customerID,
        orderID,
        logID,
        note,
      ]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in addCancelOrders:", err);
    return [];
  }
};

const addDeclineOrders = async (declineOrders) => {
  const { staffID, orderID, logID, note } = declineOrders;
  try {
    const res = await dbs
      .promise()
      .query(`CALL addDeclineOrders(?, ?, ?, ?)`, [
        staffID,
        orderID,
        logID,
        note,
      ]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in addCanaddDeclineOrderscelOrders:", err);
    return [];
  }
};

const getAllActivePrinter = async (condition) => {
  try {
    const printerStatus = "available";
    const { colorPrinting, side } = condition;
    const res = await dbs
      .promise()
      .query(`CALL getAllActivePrinter(?, ?)`, [printerStatus, colorPrinting]);
    return res[0][0];
  } catch (err) {
    console.log("Error in getAllActivePrinter:", err);
    return [];
  }
};

const getCustomer = async (customerID) => {
  try {
    const res = await dbs.promise().query(`CALL getCustomer(?)`, [customerID]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in getCustomer:", err);
    return [];
  }
};

const getPrinterByStaffID = async (staffID) => {
  try {
    const res = await dbs
      .promise()
      .query(`CALL getPrinterByStaffID(?)`, [staffID]);
    return res[0][0];
  } catch (err) {
    console.log("Error in getPrinterByStaffID:", err);
    return [];
  }
};

const decreaseCustomerBalance = async (customerID, amount) => {
  try {
    const res = await dbs
      .promise()
      .query(`CALL decreaseCustomerBalance(?, ?)`, [customerID, amount]);
    return res[0];
  } catch (err) {
    console.log("Error in updateCustomerBalance:", err);
  }
};

const increaseCustomerBalance = async (customerID, amount) => {
  try {
    const res = await dbs
      .promise()
      .query(`CALL increaseCustomerBalance(?, ?)`, [customerID, amount]);
    return res[0];
  } catch (err) {
    console.log("Error in updateCustomerBalance:", err);
  }
};

const getOrderCost = async (orderID) => {
  try {
    const res = await dbs.promise().query(`CALL getOrderCost(?)`, [orderID]);
    return res[0][0];
  } catch (err) {
    console.log("Error in getOrderCost:", err);
  }
};

const addPrintingLog = async (printingLog) => {
  try {
    const { orderID, logNumber, fileID } = printingLog;
    const startTime = new Date();
    const res = await dbs
      .promise()
      .query(`CALL addPrintingLog(?, ?, ?, ?)`, [
        orderID,
        logNumber,
        startTime,
        fileID,
      ]);
    return res[0][0][0];
  } catch (err) {
    console.log("Error in addPrintingLog:", err);
  }
};

const updatePrintingLogEndTime = async (fileID) => {
  try {
    const endTime = new Date();
    const res = await dbs
      .promise()
      .query(`CALL updatePrintingLogEndTime(?, ?)`, [fileID, endTime]);
    return res[0];
  } catch (err) {
    console.log("Error in updatePrintingLogEndTime:", err);
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
  getPrinterByStaffID,
  decreaseCustomerBalance,
  increaseCustomerBalance,
  getOrderCost,
  addPrintingLog,
  updatePrintingLogEndTime,
};
