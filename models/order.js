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
    console.error("Error in addOrder:", err);
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
    console.error("Error in addOrder:", err);
  }
};

const addPackage = async (packageInfo) => {
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
    console.error("Error in addOrder:", err);
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
    console.error("Error in getOrder:", err);
    return [];
  }
};

export { addOrder, getOrderByPrinterID, updateOrderStatus };
