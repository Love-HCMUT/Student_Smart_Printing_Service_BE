DELIMITER $$
CREATE PROCEDURE GetPaymentActionLog(IN userId INT) 
BEGIN
	SELECT * 
    FROM (
		SELECT
			p.money AS money,
			p.paymentTime  AS time,
			'AddCoin' AS paymentStatus
		FROM
			depositLog as d
		JOIN
			paymentLog AS p 
		ON 
			d.id = p.id
		WHERE
			d.customerID = userId
	
		UNION ALL
    
		SELECT 
			p.money AS money,
			p.paymentTime  AS time,
			'MinusCoin' AS paymentStatus
		FROM
			makeOrders AS m
		JOIN
			paymentLog AS p 
		ON 
			m.orderID = p.id
		WHERE
			m.customerID = userId
            AND m.orderID 
            NOT IN (
				SELECT orderID
                FROM declineOrders
            )
		
	) AS CombinedLogs
    ORDER BY time DESC
    LIMIT 3;	
END$$