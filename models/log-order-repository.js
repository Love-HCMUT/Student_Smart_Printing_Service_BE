import dbs from "../config/mysql-dbs.js";

export class historyRepository {
    static getOrderHistoryFromDB = async (customerId) => {
        const query = 'CALL GetCustomerOrders(?)';
        const [rows] = await dbs.promise().query(query, [customerId]);
        return rows[0];
    };

    static cancelOrderFromDB = async (orderId, note) => {
        if (note === undefined) note = null
        const query = `CALL CancelOrder(?)`;
        try {
            await dbs.promise().query(query, [orderId]);
        } catch (error) {
            throw new Error(error.message);
        }
        return 'Order has been cancelled';
    };

    static getOrderAllFromDB = async () => {
        const query = `CALL getOrderLog()`;
        const [rows] = await dbs.promise().query(query, []);
        return rows
    };

    static getOrderPaginationFromDB = async (page, limit) => {
        const query = `CALL getOrderPagination(?, ?)`;
        const [rows] = await dbs.promise().query(query, [parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]);
        return rows[0]
    }

    static getOrderCountFromDB = async () => {
        const query = `SELECT COUNT(*) AS totalOrder FROM makeOrders`;
        const [rows] = await dbs.promise().query(query);
        return rows[0];
    }
}