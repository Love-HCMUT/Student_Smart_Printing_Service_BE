DELIMITER // 

DROP PROCEDURE IF EXISTS SavePaymentDepositLog //

CREATE PROCEDURE SavePaymentDepositLog (
    IN payTime DATETIME, 
    IN paymentAmount INT, 
    IN note VARCHAR(255), 
    IN customerID INT
)
BEGIN
    DECLARE PaymentLogId INT;
    START TRANSACTION;

    -- Chèn vào paymentLog và lấy ID
    INSERT INTO paymentLog (paymentTime, money) 
    VALUES (payTime, paymentAmount);
    SET PaymentLogId = LAST_INSERT_ID();

    -- Kiểm tra nếu PaymentLogId không hợp lệ
    IF PaymentLogId IS NULL OR PaymentLogId < 0 THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: PaymentLogId is undefined';
    ELSE
        -- Chèn vào depositLog nếu không có lỗi
        INSERT INTO depositLog (id, method, note, customerID) 
        VALUES (PaymentLogId, 'momo-wallet', note, customerID);
        COMMIT;
    END IF;

    SELECT PaymentLogId AS PaymentLogId;
END //


DROP PROCEDURE IF EXISTS saveDepositCombo //

CREATE PROCEDURE saveDepositCombo(
    IN depositId INT, 
    IN comboId VARCHAR(255), 
    IN quantity INT
)
BEGIN
    IF EXISTS (SELECT 1 FROM combo WHERE id = comboId) THEN
        INSERT INTO depositCombo (LogID, comboID, quantity)
        VALUES (depositId, comboId, quantity);
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'comboID does not exist in combo table';
    END IF;
END //


DROP PROCEDURE IF EXISTS LoadCombo //

CREATE PROCEDURE LoadCombo() 
BEGIN
    SELECT * FROM combo;
END //

DELIMITER ;


