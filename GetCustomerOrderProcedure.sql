DELIMITER $$
CREATE PROCEDURE GetCustomerOrders (
    IN customerID INT
)
BEGIN
    SELECT 
        u.id AS orderID,
        u.orderDate AS orderDate,
        CASE
            WHEN c.orderID IS NOT NULL THEN 'Cancelled'
            WHEN d.orderID IS NOT NULL THEN 'Declined'
            ELSE u.orderStatus
        END AS orderStatus,
        u.completeTime AS completeAt,
        COALESCE(c.note, m.note) AS note
    FROM userOrders AS u
    LEFT JOIN makeOrders AS m
        ON u.id = m.orderID AND m.customerID = customerID
    LEFT JOIN declineOrders AS d
        ON u.id = d.orderID
    LEFT JOIN cancelOrders AS c
        ON u.id = c.orderID AND c.customerID = customerID
    WHERE (m.customerID = customerID OR c.customerID = customerID);
END$$

DELIMITER ;
