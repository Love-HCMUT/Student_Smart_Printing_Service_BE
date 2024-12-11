DROP PROCEDURE IF EXISTS getOrderPagination;
DELIMITER $$
CREATE PROCEDURE getOrderPagination(
	pageSize INT,
    offset INT
)
BEGIN
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
LIMIT pageSize OFFSET offset;
END $$
DELIMITER 