DROP PROCEDURE IF EXISTS getCustomerTransaction;

DELIMITER $$
CREATE PROCEDURE getCustomerTransaction(
	cID INT
)
BEGIN
SELECT 
    p.paymentTime AS date_of_transaction,
    SUM(c.numCoins) AS number_of_coins,
    d.method AS method,
    GROUP_CONCAT(dc.comboID) AS combo_list,
    p.money AS charge,
    d.note AS note
FROM
    depositLog AS d
        JOIN
    paymentLog AS p ON d.id = p.id
        JOIN
    depositCombo AS dc ON d.id = dc.logID
        JOIN
    combo AS c ON c.id = dc.comboID
WHERE
    d.customerID = cID
GROUP BY p.paymentTime, d.method, d.note
ORDER BY p.paymentTime DESC;
END $$

DELIMITER 