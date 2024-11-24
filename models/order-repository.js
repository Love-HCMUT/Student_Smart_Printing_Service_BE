import dbs from "../config/mysql-dbs.js";

export class historyRepository {
    static getOrderHistoryFromDB = async (customerId) => {
        const query = 'CALL GetCustomerOrders(?)';
        const [rows] = await dbs.promise().query(query, [customerId]);
        return rows;
    };

    static cancelOrderFromDB = async (orderId, note) => {
        const query = `
            INSERT INTO cancelOrders (customerID, orderID, logID, note)
            SELECT m.customerID, m.orderID, m.logID, ? AS note
            FROM makeOrders AS m
                WHERE m.orderID = ?
                AND NOT EXISTS (   
                    SELECT c.customerID, c.orderID
                    FROM cancelOrders AS c
                    WHERE c.customerID = m.customerID
                        AND c.orderID = m.orderID);`;
        const [rows] = await dbs.promise().query(query, [note, orderId]);
        return `Order ${orderId} has been canceled`;
    };

    static getOrderAllFromDB = async (customerId) => {
        const query = `SELECT 
                            customerID AS userID,
                            printerID AS printerID,
                            staffID AS printingStaffID,
                            fileName AS fileName,
                            startTime AS startTime,
                            endTime AS endTime,
                            numPages AS numberOfPage
                        FROM
                            makeOrders AS m
                        JOIN
                            paymentLog AS p ON m.logID = p.id
                        JOIN
                            userOrders AS u ON m.orderID = u.id
                        JOIN
                            printingLog AS pl ON u.id = pl.orderID
                        JOIN
                            fileMetadata AS f ON pl.fileID = f.id`;
        const [rows] = await dbs.promise().query(query, [customerId]);
        return rows
    };
}