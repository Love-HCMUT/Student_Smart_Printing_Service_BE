import dbs from "../config/mysql-dbs.js";

const addOrder = async (printerID) => {
  const orderStatus = "Pending";
  const orderDate = new Date();
  try {
    const res = await dbs
      .promise()
      .query(
        `INSERT INTO userOrders (orderStatus, orderDate, printerID) VALUES (?, ?, ?)`,
        [orderStatus, orderDate, printerID]
      );
    console.log(res);
    return res;
  } catch (err) {
    console.error("Error in addOrder:", err);
  }
};

const getOrder = async (printerID) => {
  try {
    const orders = await dbs
      .promise()
      .query(
        `SELECT * FROM userOrders WHERE printerID = ? AND lower(orderStatus) != 'completed'`,
        [printerID]
      );
    orders.pop();
    console.log(orders);
    return orders;
  } catch (err) {
    console.error("Error in getOrder:", err);
    return [];
  }
};

export { addOrder, getOrder };
