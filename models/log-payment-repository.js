import dbs from "../config/mysql-dbs.js";

export class paymentRepository {
  static getCustomerBalance = async (customerId) => {
    const query = "SELECT balance FROM customer WHERE id = ?";
    const [rows] = await dbs.promise().query(query, [customerId]);
    return rows.length ? rows[0].balance : null;
  };

  static getRecentTransitionFromDB = async (customerId) => {
    const query = "CALL GetPaymentActionLog(?)";
    const [rows] = await dbs.promise().query(query, [customerId]);
    return rows.length ? rows[0] : null;
  };

  static getPaymentHistoryFromDB = async (customerId) => {
    const query = `CALL getCustomerTransaction(?)`;
    const [rows] = await dbs.promise().query(query, [customerId]);
    return rows[0];
  };

  // static getTransactionAllFromDB = async () => {
  //   const query = `CALL getAllTransaction(?)`;
  //   const [rows] = await dbs.promise().query(query);
  //   return rows[0];
  // };

  static getTransactionPaginationFromDB = async (page, limit) => {
    const query = `CALL getTransactionPagination(?, ?)`;

    const [rows] = await dbs
      .promise()
      .query(query, [parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]);
    return rows[0];
  };

  static getTransactionCountFromDB = async () => {
    const query = ` SELECT COUNT(*) AS totalTransaction FROM depositLog`;
    const [rows] = await dbs.promise().query(query);
    return rows[0];
  };
}
