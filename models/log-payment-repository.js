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
    SUM(c.numCoins) AS number_of_coins,
    d.method AS method,
    GROUP_CONCAT(dc.comboID) AS combo_list,
    p.money AS charge,
    d.note AS note
FROM
    depositLog AS d
        JOIN
    paymentLog AS p ON d.id = p.id
        JOIN
    depositCombo AS dc ON d.id = dc.logID
        JOIN
    combo AS c ON c.id = dc.comboID
WHERE
    d.customerID = ?
GROUP BY p.paymentTime, d.method, d.note;
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

    static getTransactionPaginationFromDB = async (page, limit) => {
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
                        GROUP BY paymentLog.id
                        ORDER BY paymentTime DESC
                        LIMIT ? OFFSET ?`

        const [rows] = await dbs.promise().query(query, [parseInt(limit), (parseInt(page) - 1) * parseInt(limit)])
        return rows
    }

    static getTransactionCountFromDB = async () => {
        const query = ` SELECT COUNT(*) AS totalTransaction FROM depositLog`
        const [rows] = await dbs.promise().query(query)
        return rows[0]
    }
}