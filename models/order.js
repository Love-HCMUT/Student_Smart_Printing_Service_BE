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
    return res;
  } catch (err) {
    console.log("Error in addOrder:", err);
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
    return res;
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
    return res;
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
    return res;
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
    return res;
  } catch (err) {
    console.log("Error in addPackage:", err);
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
    return res;
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

const getOrderByPrinterID = async (printerID) => {
  try {
    const orders = await dbs
      .promise()
      .query(
        `SELECT * FROM userOrders WHERE printerID = ? AND lower(orderStatus) != 'completed'`,
        [printerID]
      );
    return orders[0];
  } catch (err) {
    console.log("Error in getOrderByPrinterID:", err);
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
};
