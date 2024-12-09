import dbs from "../config/mysql-dbs.js";

export class statisticRepository {
    static getRecentlyMonthlyOrderFromDB = async (month, year) => {
        const query = `CALL getRecentlyMonthlyOrder(?, ?)`;
        const [rows] = await dbs.promise().query(query, [month, year]);
        return rows[0];
    };

    static getRecentlyMonthlyTransactionFromDB = async (currentMonth, currentYear) => {
        const query = `CALL getRecentlyMonthlyTransaction(?, ?)`;
        const [rows] = await dbs.promise().query(query, [currentMonth, currentYear]);
        return rows[0];
    };

    static getTotalCancelOrderFromDB = async (currentMonth, currentYear) => {
        const query = `CALL getTotalCancelOrderByMonth(?, ?)`;
        const [rows] = await dbs.promise().query(query, [currentMonth, currentYear, currentMonth, currentYear]);
        return rows[0];
    };

    static getTotalCancelOrderByYearFromDB = async (currentYear) => {
        const query = `
            CALL getTotalCancelOrderByYear(?);
        `;
        const [rows] = await dbs.promise().query(query, [currentYear, currentYear]);
        return rows[0];
    }

    static getRecentlyYearlyOrderFromDB = async (currentYear) => {
        const query = `
            CALL getRecentlyYearlyOrder(?);
        `;
        const [rows] = await dbs.promise().query(query, [currentYear]);
        return rows[0];
    };

    static getRecentlyYearlyTransactionFromDB = async (currentYear) => {
        const query = `
            CALL getRecentlyYearlyTransaction(?);
        `;
        const [rows] = await dbs.promise().query(query, [currentYear]);
        return rows[0];
    };
}