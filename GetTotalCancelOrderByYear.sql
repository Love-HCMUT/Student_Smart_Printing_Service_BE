DROP PROCEDURE IF EXISTS getTotalCancelOrderByYear; 
DELIMITER $$
CREATE PROCEDURE getTotalCancelOrderByYear(
	y INT
)
BEGIN
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
                    YEAR(paymentLog.paymentTime) = y
                UNION ALL 
                SELECT 
                    COUNT(*) AS totalCanceledOrder
                FROM
                    declineOrders 
                JOIN 
                    paymentLog ON declineOrders.logID = paymentLog.id
                WHERE 
                    YEAR(paymentLog.paymentTime) = y
                ) AS combined;
END $$
DELIMITER 
