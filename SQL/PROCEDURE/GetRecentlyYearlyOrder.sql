DROP PROCEDURE IF EXISTS getRecentlyYearlyOrder;
DELIMITER $$
CREATE PROCEDURE getRecentlyYearlyOrder(
	y INT
)
BEGIN
	SELECT 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m') AS MonthYear, 
                COUNT(*) AS OrderCount
            FROM 
                makeOrders 
            JOIN 
                paymentLog ON makeOrders.logID = paymentLog.id
            WHERE
                YEAR(paymentLog.paymentTime) = y 
            GROUP BY 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m')
            ORDER BY 
                MonthYear;
END $$
DELIMITER 