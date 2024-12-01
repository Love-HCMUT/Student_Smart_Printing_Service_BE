DROP PROCEDURE IF EXISTS CancelOrder;

DELIMITER $$

CREATE PROCEDURE CancelOrder (
    IN oID INT
)
BEGIN
    INSERT INTO returnLog (id)
    SELECT DISTINCT m.logID
    FROM makeOrders AS m
    WHERE m.orderID = oID
    AND NOT EXISTS (
        SELECT 1
        FROM returnLog AS r
        WHERE r.id = m.logID
    );

    INSERT INTO cancelOrders (customerID, orderID, logID, note)
    SELECT 
        m.customerID, m.orderID, m.logID, m.note
    FROM
        makeOrders AS m
    WHERE
        m.orderID = oID
        AND NOT EXISTS (
            SELECT 1
            FROM cancelOrders AS c
            WHERE c.customerID = m.customerID
            AND c.orderID = m.orderID
        )
        AND EXISTS (
            SELECT 1
            FROM returnLog AS r
            WHERE r.id = m.logID
        );
END $$

DELIMITER ;