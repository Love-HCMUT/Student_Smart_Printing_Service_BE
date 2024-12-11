DROP PROCEDURE IF EXISTS CancelOrder;

DELIMITER $$

CREATE PROCEDURE CancelOrder (
    IN oID INT
)
BEGIN
    DECLARE orderStatus VARCHAR(50);
    DECLARE customerID INT;
    DECLARE orderID INT;
    DECLARE logID INT;
    DECLARE note VARCHAR(255);
    
    IF oID IS NULL OR oID <= 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid order ID';
    END IF;

SELECT 
    u.orderStatus
INTO orderStatus FROM
    userOrders AS u
WHERE
    u.id = oID;

    IF orderStatus IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Order not found';
    END IF;

    IF orderStatus = 'Cancelled' OR orderStatus = 'Declined' OR orderStatus = 'Completed' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Order already cancelled or declined or completed';
    END IF;
    
SELECT 
    m.customerID, m.orderID, m.logID, m.note
INTO customerID , orderID , logID , note FROM
    makeOrders AS m
WHERE
    m.orderID = oID;

	IF customerID IS NULL THEN
		SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No order founded in makeOrder';
    END IF;
    
	IF EXISTS (SELECT 1 FROM returnLog WHERE id = logID) THEN
    SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order already cancelled!';
	END IF;
    
    INSERT INTO returnLog (id) VALUES (logID);
    
    UPDATE printingLog
    SET printingLog.endTime = now()
    WHERE printingLog.orderID = oID;
    
    INSERT INTO cancelOrders (customerID, orderID, logID, note)
    VALUES (customerID, orderID, logID, 'Cancelled by customer');
END $$

DELIMITER ;