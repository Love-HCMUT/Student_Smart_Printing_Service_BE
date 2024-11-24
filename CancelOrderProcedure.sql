DELIMITER $$
CREATE PROCEDURE cancelOrder (
    IN orderID INT
)
BEGIN
	
    INSERT INTO cancelOrder (
        customerID, orderID, logID, note
    ) VALUES (
        (SELECT * FROM orders WHERE orderID = orderID),
    )
END$$

DELIMITER ;