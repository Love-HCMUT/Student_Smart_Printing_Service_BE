import dbs from "../config/mysql-dbs.js";

const addOrder = async (printerID) => {
  try {
    const orderStatus = "Pending";
    const orderDate = new Date();
    const res = await dbs
      .promise()
      .query(
        `INSERT INTO userOrders (orderStatus, orderDate, printerID) VALUES (?, ?, ?)`,
        [orderStatus, orderDate, printerID]
      );
    return res[0];
  } catch (err) {
    console.log("Error in addOrder:", err);
    return [];
  }
};

const getOrderByPrinterID = async (printerID) => {
  try {
    const res = await dbs
      .promise()
      .query(
        `SELECT * FROM userOrders WHERE printerID = ? AND lower(orderStatus) != 'completed'`,
        [printerID]
      );
    return res[0];
  } catch (err) {
    console.log("Error in getOrderByPrinterID:", err);
    return [];
  }
};

const updateOrderStatus = async (id, orderStatus) => {
  try {
    const res = await dbs
      .promise()
      .query(`UPDATE userOrders SET orderStatus = ? WHERE id = ?`, [
        orderStatus,
        id,
      ]);
    return res[0];
  } catch (err) {
    console.log("Error in updateOrderStatus:", err);
    return [];
  }
};

const updateOrderCompleteTime = async (id) => {
  try {
    const orderStatus = "Completed";
    const completeTime = new Date();
    const res = await dbs
      .promise()
      .query(
        `UPDATE userOrders SET orderStatus = ?, completeTime = ? WHERE id = ?`,
        [orderStatus, completeTime, id]
      );
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
      .query(`UPDATE userOrders SET staffID = ? WHERE id = ?`, [staffID, id]);
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
      .query(
        `INSERT INTO package (numOfCopies, side, colorAllPages, pagePerSheet, paperSize, scale, cover, glass, binding, orderID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
        ]
      );
    return res[0];
  } catch (err) {
    console.log("Error in addPackage:", err);
    return [];
  }
};

const getPackageByOrderID = async (orderID) => {
  try {
    const res = await dbs
      .promise()
      .query(`SELECT * FROM package WHERE orderID = ?`, [orderID]);
    return res[0];
  } catch (err) {
    console.log("Error in getPackagePrintingPagesByPackageID:", err);
    return [];
  }
};

const addPackagePrintingPages = async (printingPages) => {
  try {
    const { packageID, color, fromPage, toPage } = printingPages;
    const res = await dbs
      .promise()
      .query(
        `INSERT INTO packageprintingpages (packageID, color, fromPage, toPage) VALUES (?, ?, ?, ?)`,
        [packageID, color, fromPage, toPage]
      );
    return res[0];
  } catch (err) {
    console.log("Error in addPackagePrintingPages:", err);
    return [];
  }
};

const getPackagePrintingPagesByPackageID = async (packageID) => {
  try {
    const res = await dbs
      .promise()
      .query(`SELECT * FROM packageprintingpages WHERE packageID = ?`, [
        packageID,
      ]);
    return res[0];
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
      .query(
        `INSERT INTO filemetadata (fileName, size, numPages, url, packageID) VALUES (?, ?, ?, ?, ?)`,
        [fileName, size, numPages, url, packageID]
      );
    return res[0];
  } catch (err) {
    console.log("Error in addFileMetadata:", err);
    return [];
  }
};

const getFileMetadataByPackageID = async (packageID) => {
  try {
    const res = await dbs
      .promise()
      .query(`SELECT * FROM filemetadata WHERE packageID = ?`, [packageID]);
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
      .query(`INSERT INTO paymentLog (paymentTime, money) VALUES (?, ?)`, [
        paymentTime,
        money,
      ]);
    return res[0];
  } catch (err) {
    console.log("Error in addPaymentLog:", err);
    return [];
  }
};

const addWithdrawLog = async (id) => {
  try {
    const res = await dbs
      .promise()
      .query(`INSERT INTO withdrawlog (id) VALUES (?)`, [id]);
    return res[0];
  } catch (err) {
    console.log("Error in addWithdrawLog:", err);
    return [];
  }
};

const addReturnLog = async (id) => {
  try {
    const res = await dbs
      .promise()
      .query(`INSERT INTO returnlog (id) VALUES (?)`, [id]);
    return res[0];
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
      .query(
        `INSERT INTO makeorders (customerID, orderID, logID, note) VALUES (?, ?, ?, ?)`,
        [customerID, orderID, logID, note]
      );
    return res[0];
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
      .query(
        `INSERT INTO cancelorders (customerID, orderID, logID, note) VALUES (?, ?, ?, ?)`,
        [customerID, orderID, logID, note]
      );
    return res[0];
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
      .query(
        `INSERT INTO declineorders (staffID, orderID, logID, note) VALUES (?, ?, ?, ?)`,
        [staffID, orderID, logID, note]
      );
    return res[0];
  } catch (err) {
    console.log("Error in addCanaddDeclineOrderscelOrders:", err);
    return [];
  }
};

const getAllActivePrinter = async (condition) => {
  try {
    const printerStatus = "active";
    const { colorPrinting, side } = condition;
    const res = await dbs
      .promise()
      .query(
        `SELECT * FROM printer WHERE printerStatus = ? AND colorPrinting = ? AND side = ?`,
        [printerStatus, colorPrinting, side]
      );
    return res[0];
  } catch (err) {
    console.log("Error in getAllActivePrinter:", err);
    return [];
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
};
