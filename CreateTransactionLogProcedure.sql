DROP PROCEDURE IF EXISTS GenerateTransactionLog;
DELIMITER //

CREATE PROCEDURE GenerateTransactionLog(
    IN totalRecords INT -- Số lượng bản ghi muốn tạo
)
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE randomComboId INT;
    DECLARE randomCustomerId INT;
    DECLARE randomStaffId INT;
    DECLARE randomPrinterId INT;
    DECLARE randomDate DATETIME;
    DECLARE randomMoney DECIMAL(10, 2);
    DECLARE randomQuantity INT;
    DECLARE startDate DATETIME DEFAULT DATE_FORMAT(NOW(), '%Y-01-01'); -- Ngày bắt đầu từ tháng 1 năm nay
    DECLARE endDate DATETIME DEFAULT NOW(); -- Thời gian hiện tại

    WHILE i < totalRecords DO
        -- Random comboId từ 1 đến 10
        SET randomComboId = FLOOR(1 + RAND() * 10);

        -- Random customerId từ 1 đến 5
        SET randomCustomerId = FLOOR(1 + RAND() * 5);

        -- Random staffId từ 1 đến 5
        SET randomStaffId = FLOOR(1 + RAND() * 5);

        -- Random printerId từ 1 đến 10
        SET randomPrinterId = FLOOR(1 + RAND() * 10);

        -- Random datetime từ tháng 1 năm nay đến thời điểm hiện tại
        SET randomDate = DATE_ADD(
            startDate, 
            INTERVAL FLOOR(RAND() * TIMESTAMPDIFF(SECOND, startDate, endDate)) SECOND
        );

        -- Random money từ 100 đến 1000
        SET randomMoney = FLOOR(100 + RAND() * 900);

        -- Random quantity từ 10 đến 20
        SET randomQuantity = FLOOR(10 + RAND() * 11);

        -- Thêm dữ liệu vào bảng paymentLog
        INSERT INTO paymentLog (paymentTime, money)
        VALUES (randomDate, randomMoney);

        -- Lấy ID vừa thêm vào bảng paymentLog
        SET @paymentLogID = LAST_INSERT_ID();

        -- Thêm dữ liệu vào bảng depositLog
        INSERT INTO depositLog (id, method, note, customerID)
        VALUES (@paymentLogID, 'Credit Card', '', randomCustomerId);

        -- Thêm dữ liệu vào bảng depositCombo
        INSERT INTO depositCombo (logID, comboID, quantity)
        VALUES (@paymentLogID, randomComboId, randomQuantity);

        -- Tăng bộ đếm
        SET i = i + 1;
    END WHILE;
END;
//

DELIMITER ;

CALL GenerateTransactionLog(5000)