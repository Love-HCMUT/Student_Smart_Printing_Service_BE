DROP PROCEDURE IF EXISTS GeneratePrintingHistory;

DELIMITER $$

CREATE PROCEDURE GeneratePrintingHistory(
    IN numRecords INT
)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE randomCustomerID INT;
    DECLARE randomStaffID INT;
    DECLARE randomPrinterID INT;
    DECLARE randomComboID INT;
    DECLARE randomOrderStatus VARCHAR(20);
    DECLARE randomOrderDate DATETIME;
    DECLARE randomCompleteTime DATETIME;
    DECLARE randomNumOfCopies INT;
    DECLARE randomSide CHAR(1);
    DECLARE randomColorAllPages BOOLEAN;
    DECLARE randomPaperSize VARCHAR(10);
    DECLARE randomStartTime DATETIME;
    DECLARE randomEndTime DATETIME;
    DECLARE randomPaymentTime DATETIME;
    DECLARE randomMoney INT;
    DECLARE randomMakeOrderID INT; -- Biến để lưu ID của makeOrder
    DECLARE randomOrderID INT; -- Biến để lưu ID của userOrder
    DECLARE randomLogID INT; -- Biến để lưu ID của withdrawLog
    DECLARE randomFileID INT; -- Biến để lưu ID của fileMetadata
    DECLARE randomPackageID INT; -- Biến để lưu ID của package

    WHILE i <= numRecords DO
        -- Random hóa các giá trị
        SET randomCustomerID = FLOOR(1 + RAND() * 5);
        SET randomStaffID = FLOOR(1 + RAND() * 5);
        SET randomPrinterID = FLOOR(1 + RAND() * 10);
        SET randomComboID = FLOOR(1 + RAND() * 10);
        SET randomOrderStatus = IF(RAND() > 0.5, 'Completed', 'Pending');
        SET randomOrderDate = TIMESTAMP(DATE(FROM_DAYS(TO_DAYS(CURDATE()) - FLOOR(RAND() * 330))), TIME(NOW()));
        SET randomCompleteTime = DATE_ADD(randomOrderDate, INTERVAL FLOOR(1 + RAND() * 5) HOUR);
        SET randomNumOfCopies = FLOOR(1 + RAND() * 10);
        SET randomSide = IF(RAND() > 0.5, '1', '2');
        SET randomColorAllPages = RAND() > 0.5;
        SET randomPaperSize = IF(RAND() > 0.5, 'A4', 'A3');
        SET randomStartTime = DATE_ADD(randomOrderDate, INTERVAL FLOOR(RAND() * 2) HOUR);
        SET randomEndTime = DATE_ADD(randomStartTime, INTERVAL FLOOR(1 + RAND() * 2) HOUR);
        SET randomPaymentTime = DATE_ADD(randomOrderDate, INTERVAL FLOOR(RAND() * 3) HOUR);
        SET randomMoney = FLOOR(10000 + RAND() * 90000);

        -- Insert vào bảng paymentLog
        INSERT INTO paymentLog (paymentTime, money)
        VALUES (randomPaymentTime, randomMoney);

        -- Lấy ID của paymentLog
        SET randomLogID = LAST_INSERT_ID();

        -- Insert vào bảng withdrawLog
        INSERT INTO withdrawLog (id)
        VALUES (randomLogID);

        -- Lấy ID của withdrawLog
        SET randomLogID = LAST_INSERT_ID();

        -- Insert vào bảng userOrders và lấy ID của nó
        INSERT INTO userOrders (orderStatus, orderDate, completeTime, printerID, staffID)
        VALUES (randomOrderStatus, randomOrderDate, randomCompleteTime, randomPrinterID, randomStaffID);

        -- Lưu ID của userOrder
        SET randomOrderID = LAST_INSERT_ID();

        -- Insert vào bảng makeOrders (dùng orderID từ userOrders và logID từ withdrawLog)
        INSERT INTO makeOrders (customerID, orderID, logID, note)
        VALUES (randomCustomerID, randomOrderID, randomLogID, CONCAT('Note for order ', i));

        -- Lưu ID của makeOrder
        SET randomMakeOrderID = LAST_INSERT_ID();

        -- Insert vào bảng package
        INSERT INTO package (numOfCopies, side, colorAllPages, paperSize, orderID)
        VALUES (randomNumOfCopies, randomSide, randomColorAllPages, randomPaperSize, randomOrderID);

        -- Lấy ID của package
        SET randomPackageID = LAST_INSERT_ID();

        -- Insert vào bảng packagePrintingPages
        INSERT INTO packagePrintingPages (packageID, color, fromPage, toPage)
        VALUES (randomPackageID, randomColorAllPages, 1, randomNumOfCopies);

        -- Insert vào bảng fileMetadata (Giả sử có một file metadata mẫu)
        INSERT INTO fileMetadata (fileName, size, numPages, url, packageID)
        VALUES (CONCAT('File_', i, '.pdf'), FLOOR(RAND() * 1000), randomNumOfCopies, CONCAT('url_of_file_', i), randomPackageID);

        -- Lấy ID của fileMetadata
        SET randomFileID = LAST_INSERT_ID();

        -- Insert vào bảng printingLog
        INSERT INTO printingLog (orderID, logNumber, startTime, endTime, fileID)
        VALUES (randomOrderID, i, randomStartTime, randomEndTime, randomFileID);

        -- Tăng chỉ số lặp
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

CALL GeneratePrintingHistory(20);
