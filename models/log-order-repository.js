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
        const rows = await dbs.promise().query(query, [orderId]);
        return 'hello'
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

    static getOrderPaginationFromDB = async (page, limit) => {
        const query = `
                        SELECT 
    m.customerID AS userID,
    printerID AS printerID,
    u.staffID AS printingStaffID,
    fileName AS fileName,
    startTime AS startTime,
    endTime AS endTime,
    numPages AS numberOfPage,
    CASE
        WHEN c.orderID IS NOT NULL THEN 'Cancelled'
        WHEN d.orderID IS NOT NULL THEN 'Declined'
        ELSE u.orderStatus
    END AS status
FROM
    makeOrders AS m
        LEFT JOIN
    paymentLog AS p ON m.logID = p.id
        LEFT JOIN
    userOrders AS u ON m.orderID = u.id
        LEFT JOIN
    printingLog AS pl ON u.id = pl.orderID
        LEFT JOIN
    fileMetadata AS f ON pl.fileID = f.id
        LEFT JOIN
    cancelOrders AS c ON m.orderID = c.orderID
        LEFT JOIN
    declineOrders AS d ON m.orderID = d.orderID
GROUP BY startTime , endTime , fileName , numberOfPage , printerID , printingStaffID , userID , status
LIMIT 10 OFFSET 0`;
        const [rows] = await dbs.promise().query(query, [parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]);
        return rows
    }

    static getOrderCountFromDB = async () => {
        const query = `SELECT COUNT(*) AS totalOrder FROM makeOrders`;
        const [rows] = await dbs.promise().query(query);
        return rows[0];
    }
}