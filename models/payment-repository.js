import dbs from "../config/mysql-dbs.js";

export class paymentRepository {
    static getCustomerBalance = async (customerId) => {
        const query = 'SELECT balance FROM customer WHERE id = ?';
        const [rows] = await dbs.promise().query(query, [customerId]);
        return rows.length ? rows[0].balance : null;
    };

    static getRecentTransitionFromDB = async (customerId) => {
        const query = 'CALL GetPaymentActionLog(?)';
        const [rows] = await dbs.promise().query(query, [customerId]);
        return rows.length ? rows[0] : null;
    };

    static getPaymentHistoryFromDB = async (customerId) => {
        const query = `
            SELECT 
                p.paymentTime AS date_of_transaction,
                c.numCoins AS number_of_coins,
                d.method AS method,
                GROUP_CONCAT(dc.comboID) AS combo_list,
                p.money AS charge,
                d.note AS note
            FROM 
                depositLog AS d
            JOIN 
                paymentLog AS p
            ON d.id = p.id
            JOIN 
                depositCombo AS dc
                ON d.id = dc.comboID
            JOIN
                combo AS c
                ON c.id = dc.comboID
            WHERE 
                d.customerID = 1
            GROUP BY 
                p.paymentTime, c.numCoins, d.method, p.money;
        `;
        const [rows] = await dbs.promise().query(query, [customerId]);
        return rows;
    };

    static getTransactionAllFromDB = async () => {
        const query = ` SELECT 
                            customerID AS ID,
                            paymentTime AS dateOfTransaction,
                            SUM(depositCombo.quantity * combo.numCoins) AS coins,
                            SUM(depositCombo.quantity * combo.price) 	AS charge, 
                            method AS paymentMethod,
                            note
                        FROM
                            depositLog
                        JOIN
                            paymentLog ON depositLog.id = paymentLog.id
                        JOIN
                            depositCombo ON depositLog.id = depositCombo.logID
                        JOIN
                            combo ON depositCombo.comboID = combo.id
                        GROUP BY paymentLog.id`;
        const [rows] = await dbs.promise().query(query);
        return rows;
    }
}