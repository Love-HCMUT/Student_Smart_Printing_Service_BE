DROP PROCEDURE IF EXISTS getRecentlyYearlyTransaction;
DELIMITER $$
CREATE PROCEDURE getRecentlyYearlyTransaction(
	y INT
)
BEGIN
	SELECT 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m') AS MonthYear,
                COUNT(*) AS TransactionCount
            FROM
                depositLog
            JOIN
                paymentLog ON depositLog.id = paymentLog.id
            WHERE
                YEAR(paymentLog.paymentTime) = y
            GROUP BY DATE_FORMAT(paymentLog.paymentTime, '%Y-%m')
            ORDER BY MonthYear;
END $$
DELIMITER 