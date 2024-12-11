DROP PROCEDURE IF EXISTS getCountFromRepository;
DELIMITER $$
CREATE PROCEDURE getCountFromRepository(
    IN allOrderCount BOOLEAN,
    IN allTransactionCount BOOLEAN,
    IN balanceFromCustomer BOOLEAN,
    IN customerId INT
)
BEGIN
    IF allOrderCount THEN
        SELECT COUNT(*) AS totalOrder FROM makeOrders;
    ELSEIF allTransactionCount THEN
        SELECT COUNT(*) AS totalTransaction FROM depositLog;
    ELSEIF balanceFromCustomer THEN
        SELECT COALESCE(balance, 0) AS balance FROM customer WHERE id = customerId;
    END IF;
END$$
DELIMITER ;