DROP PROCEDURE IF EXISTS getRecentlyMonthlyTransaction;
DELIMITER $$
CREATE PROCEDURE getRecentlyMonthlyTransaction(
	m INT,
    y INT
)
BEGIN
SELECT
                DATE(paymentLog.paymentTime) AS Date, 
                COUNT(*) AS TransactionCount
            FROM 
                depositLog 
            JOIN 
                paymentLog ON depositLog.id = paymentLog.id
            WHERE
                MONTH(paymentLog.paymentTime) = m
                AND YEAR(paymentLog.paymentTime) = y
            GROUP BY DATE(paymentLog.paymentTime)
            ORDER BY Date;
END $$