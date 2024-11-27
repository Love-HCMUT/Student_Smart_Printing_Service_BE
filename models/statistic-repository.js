import dbs from "../config/mysql-dbs.js";

export class statisticRepository {

    static getRecentlyMonthlyOrderFromDB = async (month, year) => {
        const query = `
            SELECT 
                DATE(paymentLog.paymentTime) AS payment_date,
                COUNT(*) AS total_orders
            FROM
                makeOrders
            JOIN
                paymentLog ON makeOrders.logID = paymentLog.id
            WHERE
                MONTH(paymentLog.paymentTime) = ?
                AND YEAR(paymentLog.paymentTime) = ?
            GROUP BY DATE(paymentLog.paymentTime)
            ORDER BY payment_date;
        `;
        const [rows] = await dbs.promise().query(query, [month, year]);
        return rows
    };

    static getTotalOrderFromDB = async () => {
        const query = `
            SELECT 
                COUNT(*) AS totalOrder
            FROM
                makeOrders;
        `;
        const [rows] = await dbs.promise().query(query);
        return rows;
    };

    static getTotalTransactionFromDB = async () => {
        const query = `
            SELECT 
                COUNT(*) AS totalTransaction
            FROM
                depositLog;
        `;
        const [rows] = await dbs.promise().query(query);
        return rows;
    }

    static getTotalUserCanceledOrderFromDB = async () => {
        const query = `
            SELECT 
                COUNT(*) AS totalCanceledOrder
            FROM
                cancelOrders
        `;
        const [rows] = await dbs.promise().query(query);
        return rows;
    };

    static getTotalPSCanceledOrderFromDB = async () => {
        const query = `
            SELECT 
                COUNT(*) AS totalCanceledOrder
            FROM
                declineOrders
        `;
        const [rows] = await dbs.promise().query(query);
        return rows;
    };

    static getNumberOfOrdersByMonthYearFromDB = async () => {
        const query = `
            SELECT 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m') AS MonthYear, 
                COUNT(*) AS OrderCount
            FROM 
                makeOrders 
            JOIN 
                paymentLog ON makeOrders.logID = paymentLog.id
            GROUP BY 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m')
            ORDER BY 
                MonthYear;
        `;
        const [rows] = await dbs.promise().query(query);
        return rows;
    };

    static getNumberOfTransactionByMonthYearFromDB = async () => {
        const query = `
            SELECT 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m') AS MonthYear,
                COUNT(*) AS TransactionCount
            FROM
                depositLog
            JOIN
	            paymentLog ON depositLog.id = paymentLog.id
            GROUP BY DATE_FORMAT(paymentLog.paymentTime, '%Y-%m')
            ORDER BY MonthYear;
        `;
        const [rows] = await dbs.promise().query(query);
        return rows;
    };
}