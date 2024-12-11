import dbs from "../config/mysql-dbs.js";
import { getCountFromRepository } from "./get-count-from-repository.js";
export class paymentRepository {
  static getCustomerBalance = async (customerId) => {
    return getCountFromRepository({
      balanceFromCustomer: true,
      customerId
    })
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

  static getTransactionPaginationFromDB = async (page, limit) => {
    const query = `CALL getTransactionPagination(?, ?)`;

    const [rows] = await dbs
      .promise()
      .query(query, [parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]);
    return rows[0];
  };

  static getTransactionCountFromDB = async () => {
    return getCountFromRepository({
      allTransactionCount: true
    });
  };
}