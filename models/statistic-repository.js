import dbs from "../config/mysql-dbs.js";

export class statisticRepository {
    static getRecentlyMonthlyOrderFromDB = async (month, year) => {
        const query = `
            SELECT 
                DATE(paymentLog.paymentTime) AS Date,
                COUNT(*) AS OrderCount
            FROM
                makeOrders
            JOIN
                paymentLog ON makeOrders.logID = paymentLog.id
            WHERE
                MONTH(paymentLog.paymentTime) = ?
                AND YEAR(paymentLog.paymentTime) = ?
            GROUP BY DATE(paymentLog.paymentTime)
            ORDER BY Date;
        `;
        const [rows] = await dbs.promise().query(query, [month, year]);
        return rows;
    };

    static getRecentlyMonthlyTransactionFromDB = async (currentMonth, currentYear) => {
        const query = `
            SELECT
                DATE(paymentLog.paymentTime) AS Date, 
                COUNT(*) AS TransactionCount
            FROM 
                depositLog 
            JOIN 
                paymentLog ON depositLog.id = paymentLog.id
            WHERE
                MONTH(paymentLog.paymentTime) = ?
                AND YEAR(paymentLog.paymentTime) = ?
            GROUP BY DATE(paymentLog.paymentTime)
            ORDER BY Date;
        `;
        const [rows] = await dbs.promise().query(query, [currentMonth, currentYear]);
        return rows;
    };

    static getCountMonthOrderDataFromDB = async (currentMonth, currentYear) => {
        const query = `
            SELECT 
                COUNT(*) AS totalOrders
            FROM
                makeOrders
            JOIN
                paymentLog ON makeOrders.logID = paymentLog.id
            WHERE
                MONTH(paymentLog.paymentTime) = ?
                AND YEAR(paymentLog.paymentTime) = ?
        `;
        const [rows] = await dbs.promise().query(query, [currentMonth, currentYear]);
        return rows;
    };

    static getCountMonthTransactionrDataFromDB = async (currentMonth, currentYear) => {
        const query = `
            SELECT 
                COUNT(*) AS totalTransactions
            FROM 
                depositLog 
            JOIN 
                paymentLog ON depositLog.id = paymentLog.id
            WHERE
                MONTH(paymentLog.paymentTime) = ?
                AND YEAR(paymentLog.paymentTime) = ?
        `;
        const [rows] = await dbs.promise().query(query, [currentMonth, currentYear]);
        return rows;
    };

    static getTotalCancelOrderFromDB = async (currentMonth, currentYear) => {
        const query = `
            SELECT 
                SUM(totalCanceledOrder) AS totalCanceledOrder
            FROM
                (SELECT 
                    COUNT(*) AS totalCanceledOrder
                FROM
                    cancelOrders 
                JOIN 
                    paymentLog ON cancelOrders.logID = paymentLog.id
                WHERE 
                    MONTH(paymentLog.paymentTime) = ?
                    AND YEAR(paymentLog.paymentTime) = ?
                UNION ALL 
                SELECT 
                    COUNT(*) AS totalCanceledOrder
                FROM
                    declineOrders 
                JOIN 
                    paymentLog ON declineOrders.logID = paymentLog.id
                WHERE 
                    MONTH(paymentLog.paymentTime) = ?
                    AND YEAR(paymentLog.paymentTime) = ?
                ) AS combined
        `;
        const [rows] = await dbs.promise().query(query, [currentMonth, currentYear, currentMonth, currentYear]);
        return rows;
    };

    static getCountYearOrderDataFromDB = async (currentYear) => {
        const query = `
            SELECT 
                COUNT(*) AS totalOrders
            FROM
                makeOrders
            JOIN
                paymentLog ON makeOrders.logID = paymentLog.id
            WHERE
                YEAR(paymentLog.paymentTime) = ?;
        `;
        const [rows] = await dbs.promise().query(query, [currentYear]);
        return rows;
    };

    static getCountYearTransactionrDataFromDB = async (currentYear) => {
        const query = `
            SELECT 
                COUNT(*) AS totalTransactions
            FROM
                depositLog
            JOIN
                paymentLog ON depositLog.id = paymentLog.id
            WHERE
                YEAR(paymentLog.paymentTime) = ?;
        `;
        const [rows] = await dbs.promise().query(query, [currentYear]);
        return rows;
    };

    static getTotalCancelOrderByYearFromDB = async (currentYear) => {
        const query = `
            SELECT 
                SUM(totalCanceledOrder) AS totalCanceledOrder
            FROM
                (SELECT 
                    COUNT(*) AS totalCanceledOrder
                FROM
                    cancelOrders 
                JOIN 
                    paymentLog ON cancelOrders.logID = paymentLog.id
                WHERE 
                    YEAR(paymentLog.paymentTime) = ?
                UNION ALL 
                SELECT 
                    COUNT(*) AS totalCanceledOrder
                FROM
                    declineOrders 
                JOIN 
                    paymentLog ON declineOrders.logID = paymentLog.id
                WHERE 
                    YEAR(paymentLog.paymentTime) = ?
                ) AS combined
        `;
        const [rows] = await dbs.promise().query(query, [currentYear, currentYear]);
        return rows;
    }

    static getRecentlyYearlyOrderFromDB = async (currentYear) => {
        const query = `
            SELECT 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m') AS MonthYear, 
                COUNT(*) AS OrderCount
            FROM 
                makeOrders 
            JOIN 
                paymentLog ON makeOrders.logID = paymentLog.id
            WHERE
                YEAR(paymentLog.paymentTime) = ?
            GROUP BY 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m')
            ORDER BY 
                MonthYear;
        `;
        const [rows] = await dbs.promise().query(query, [currentYear]);
        return rows;
    };

    static getRecentlyYearlyTransactionFromDB = async (currentYear) => {
        const query = `
            SELECT 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m') AS MonthYear,
                COUNT(*) AS TransactionCount
            FROM
                depositLog
            JOIN
                paymentLog ON depositLog.id = paymentLog.id
            WHERE
                YEAR(paymentLog.paymentTime) = ?
            GROUP BY DATE_FORMAT(paymentLog.paymentTime, '%Y-%m')
            ORDER BY MonthYear;
        `;
        const [rows] = await dbs.promise().query(query, [currentYear]);
        return rows;
    };
}