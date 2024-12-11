DROP PROCEDURE IF EXISTS getTransactionPagination;
DELIMITER $$
CREATE PROCEDURE getTransactionPagination(
	lmt INT,
    ost INT
)
BEGIN
SELECT 
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
                        LIMIT lmt OFFSET ost;
END $$

DELIMITER 