DROP PROCEDURE IF EXISTS CascadeDeleteOrderAndTransactionData;
DELIMITER $$

CREATE PROCEDURE CascadeDeleteOrderAndTransactionData()
BEGIN
    SET FOREIGN_KEY_CHECKS = 0;
	SET SQL_SAFE_UPDATES = 0;
    DELETE FROM makeOrders;
    DELETE FROM cancelOrders;
    DELETE FROM declineOrders;
    DELETE FROM returnLog;
    DELETE FROM withdrawLog;
    DELETE FROM depositCombo;
    DELETE FROM depositLog;
    DELETE FROM paymentLog;
    DELETE FROM printingLog;
    DELETE FROM fileMetadata;
    DELETE FROM packagePrintingPages;
    DELETE FROM package;
    DELETE FROM userOrders;

    SET FOREIGN_KEY_CHECKS = 1;
    SET SQL_SAFE_UPDATES = 1;
END$$

DELIMITER ;

CALL CascadeDeleteOrderAndTransactionData();