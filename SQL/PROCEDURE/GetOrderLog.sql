DROP PROCEDURE IF EXISTS getOrderLog;

DELIMITER $$
CREATE PROCEDURE getOrderLog()
BEGIN
SELECT 
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
    fileMetadata AS f ON pl.fileID = f.id;
END $$