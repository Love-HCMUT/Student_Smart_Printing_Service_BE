DROP PROCEDURE IF EXISTS getRecentlyMonthlyOrder;

DELIMITER $$
CREATE PROCEDURE getRecentlyMonthlyOrder(
	m INT,
    y INT
)
BEGIN
SELECT 
	DATE(paymentLog.paymentTime) AS Date,
	COUNT(*) AS OrderCount
FROM
	makeOrders
JOIN
	paymentLog ON makeOrders.logID = paymentLog.id
WHERE
	MONTH(paymentLog.paymentTime) = m
	AND YEAR(paymentLog.paymentTime) = y
GROUP BY DATE(paymentLog.paymentTime)
ORDER BY Date;
END $$