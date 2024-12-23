DROP PROCEDURE IF EXISTS add_account;
DROP PROCEDURE IF EXISTS find_or_add_location;
DROP PROCEDURE IF EXISTS add_customer;
DROP PROCEDURE IF EXISTS add_spso;
DROP PROCEDURE IF EXISTS add_spso_phone_number;
DROP PROCEDURE IF EXISTS add_staff_phone_number;
DROP PROCEDURE IF EXISTS add_staff;
DROP PROCEDURE IF EXISTS addLocation;
DROP PROCEDURE IF EXISTS find_account_by_username;
DROP PROCEDURE IF EXISTS CancelOrder;
DROP PROCEDURE IF EXISTS GetCustomerOrders;
DROP PROCEDURE IF EXISTS getCustomerTransaction;
DROP PROCEDURE IF EXISTS getOrderLog;
DROP PROCEDURE IF EXISTS getOrderPagination;
DROP PROCEDURE IF EXISTS GetPaymentActionLog;
DROP PROCEDURE IF EXISTS getRecentlyMonthlyOrder;
DROP PROCEDURE IF EXISTS getRecentlyMonthlyTransaction;
DROP PROCEDURE IF EXISTS getRecentlyYearlyOrder;
DROP PROCEDURE IF EXISTS getRecentlyYearlyTransaction;
DROP PROCEDURE IF EXISTS getTotalCancelOrderByMonth;
DROP PROCEDURE IF EXISTS getTotalCancelOrderByYear; 
DROP PROCEDURE IF EXISTS getTransactionPagination;
DROP PROCEDURE IF EXISTS GetPrintersBySPSO;
DROP PROCEDURE IF EXISTS AddManipulation;
DROP PROCEDURE IF EXISTS AddPrinter;
DROP PROCEDURE IF EXISTS AddManage;
DROP PROCEDURE IF EXISTS find_or_add_manage;
DROP PROCEDURE IF EXISTS UpdatePrinterStatus;
DROP PROCEDURE IF EXISTS UpdatePrinter;
DROP PROCEDURE IF EXISTS GetPrintersByIds;
DROP PROCEDURE IF EXISTS SavePaymentDepositLog;
DROP PROCEDURE IF EXISTS saveDepositCombo;
DROP PROCEDURE IF EXISTS LoadCombo;
DROP TRIGGER IF EXISTS  increase_pk_combo;
DROP PROCEDURE IF EXISTS updatePrintingLogEndTime;
DROP PROCEDURE IF EXISTS addPrintingLog;
DROP PROCEDURE IF EXISTS getOrderCost;
DROP PROCEDURE IF EXISTS increaseCustomerBalance;
DROP PROCEDURE IF EXISTS decreaseCustomerBalance;
DROP PROCEDURE IF EXISTS getPrinterByStaffID;
DROP PROCEDURE IF EXISTS getCustomer;
DROP PROCEDURE IF EXISTS getAllActivePrinter;
DROP PROCEDURE IF EXISTS addDeclineOrders;
DROP PROCEDURE IF EXISTS addCancelOrders;
DROP PROCEDURE IF EXISTS addMakeOrders;
DROP PROCEDURE IF EXISTS addReturnLog;
DROP PROCEDURE IF EXISTS addWithdrawLog;
DROP PROCEDURE IF EXISTS addPaymentLog;
DROP PROCEDURE IF EXISTS getFileMetadataByPackageID;
DROP PROCEDURE IF EXISTS addFileMetadata;
DROP PROCEDURE IF EXISTS getPackagePrintingPagesByPackageID;
DROP PROCEDURE IF EXISTS addPackagePrintingPages;
DROP PROCEDURE IF EXISTS getPackageByOrderID;
DROP PROCEDURE IF EXISTS addPackage;
DROP PROCEDURE IF EXISTS updateOrderStaffID;
DROP PROCEDURE IF EXISTS updateOrderCompleteTime;
DROP PROCEDURE IF EXISTS updateOrderStatus;
DROP PROCEDURE IF EXISTS getOrderByPrinterID;
DROP PROCEDURE IF EXISTS addOrder;
DROP PROCEDURE IF EXISTS UpdateCustomerBalance;
DROP PROCEDURE IF EXISTS getCountFromRepository;
DELIMITER $$


CREATE PROCEDURE add_account(
    IN p_username VARCHAR(50) ,
    IN p_accountPassword VARCHAR(100) ,
    IN p_fullName VARCHAR(100),
    IN p_roles VARCHAR(20) 
)
BEGIN
    INSERT INTO account (username, accountPassword, fullName, roles) 
    VALUES (p_username, p_accountPassword, p_fullName, p_roles);
    SELECT LAST_INSERT_ID() AS account_id;
END$$


CREATE PROCEDURE find_or_add_location(
    IN p_campus VARCHAR(20) ,
    IN p_building VARCHAR(20) ,
    IN p_room VARCHAR(20) 
)
BEGIN
    SELECT id FROM location WHERE campus = p_campus AND building = p_building AND room = p_room;
END$$


CREATE PROCEDURE add_customer(IN p_id INT)
BEGIN
    INSERT INTO customer (id) VALUES (p_id);
END$$


CREATE PROCEDURE add_spso(IN p_id INT)
BEGIN
    INSERT INTO spso (id) VALUES (p_id);
END$$


CREATE PROCEDURE add_spso_phone_number(IN p_id INT, IN p_phoneNumber VARCHAR(20) )
BEGIN
    INSERT INTO spsoPhoneNumbers (id, phoneNumber) VALUES (p_id, p_phoneNumber);
END$$


CREATE PROCEDURE add_staff_phone_number(IN p_id INT, IN p_phoneNumber VARCHAR(20) )
BEGIN
    INSERT INTO staffPhoneNumbers (id, phoneNumber) VALUES (p_id, p_phoneNumber);
END$$


CREATE PROCEDURE add_staff(IN p_id INT, IN p_spsoID INT, IN p_locationID INT)
BEGIN
    INSERT INTO staff (id, spsoID, locationID) VALUES (p_id, p_spsoID, p_locationID);
END$$

CREATE PROCEDURE addLocation(
    IN campus VARCHAR(20)  ,
    IN building VARCHAR(20) ,
    IN room VARCHAR(20) )
BEGIN
    INSERT INTO location (campus, building, room)
    VALUES (campus, building, room);
    SELECT LAST_INSERT_ID() AS location_id;
END$$


CREATE PROCEDURE find_account_by_username(IN p_username VARCHAR(50))
BEGIN
    SELECT * FROM account WHERE username = p_username;
END$$


CREATE PROCEDURE CancelOrder (
    IN oID INT
)
BEGIN
    DECLARE orderStatus VARCHAR(50);
    DECLARE customerID INT;
    DECLARE orderID INT;
    DECLARE logID INT;
    DECLARE note VARCHAR(255);
    DECLARE dmoney INT;

    IF oID IS NULL OR oID <= 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid order ID';
    END IF;

    START TRANSACTION;

    SELECT u.orderStatus
    INTO orderStatus
    FROM userOrders AS u
    WHERE u.id = oID;

    IF orderStatus IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Order not found';
    END IF;

    IF orderStatus = 'Cancelled' OR orderStatus = 'Declined' OR orderStatus = 'Completed' THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Order already cancelled, declined, or completed';
    END IF;

    SELECT m.customerID, m.orderID, m.logID, m.note
    INTO customerID, orderID, logID, note
    FROM makeOrders AS m
    WHERE m.orderID = oID;

    IF customerID IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No order found in makeOrders';
    END IF;

    IF EXISTS (SELECT 1 FROM returnLog WHERE id = logID) THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Order already cancelled!';
    END IF;

    SELECT money
    INTO dmoney
    FROM paymentLog
    WHERE id = logID;

    IF dmoney IS NULL THEN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Payment information not found';
    END IF;

    INSERT INTO returnLog (id)
    VALUES (logID);

    UPDATE printingLog
    SET endTime = NOW()
    WHERE orderID = oID;

    INSERT INTO cancelOrders (customerID, orderID, logID, note)
    VALUES (customerID, orderID, logID, 'Cancelled by customer');

    UPDATE customer
    SET balance = balance + dmoney
    WHERE id = customerID;

    COMMIT;
END $$

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
    WHERE (m.customerID = customerID OR c.customerID = customerID)
    ORDER BY orderDate DESC;
END$$

CREATE PROCEDURE getCustomerTransaction(
    IN cID INT
)
BEGIN
    SELECT
        date_of_transaction, number_of_coins, method, combo_list, charge, note
    FROM
    (
        -- Deposit Log transactions
        SELECT 
            p.paymentTime AS date_of_transaction,
            SUM(c.numCoins) AS number_of_coins,
            d.method AS method,
            GROUP_CONCAT(dc.comboID) AS combo_list,
            p.money AS charge,
            d.note AS note
        FROM
            depositLog AS d
            JOIN paymentLog AS p ON d.id = p.id
            LEFT JOIN depositCombo AS dc ON d.id = dc.logID
            LEFT JOIN combo AS c ON c.id = dc.comboID
        WHERE
            d.customerID = cID
        GROUP BY p.paymentTime, d.method, d.note, p.money

        UNION ALL

        -- Make Order transactions
        SELECT 
            p.paymentTime AS date_of_transaction,
            p.money AS number_of_coins,
            'Make Order' AS method,
            'NULL' AS combo_list,
            'NULL' AS charge,
            m.note AS note
        FROM 
            paymentLog AS p
            JOIN makeOrders AS m ON p.id = m.logID
        WHERE
            m.customerID = cID
        GROUP BY p.paymentTime, p.money, m.note

        UNION ALL

        -- Cancel Order transactions
        SELECT 
            p.paymentTime AS date_of_transaction,
            p.money AS number_of_coins,
            'Cancel Order' AS method,
            'NULL' AS combo_list,
            'NULL' AS charge,
            c.note AS note
        FROM 
            paymentLog AS p
            JOIN cancelOrders AS c ON p.id = c.logID
        WHERE
            c.customerID = cID
        GROUP BY p.paymentTime, p.money, c.note
    ) AS combined_transactions
    ORDER BY date_of_transaction DESC;
END $$

CREATE PROCEDURE getOrderLog()
BEGIN
SELECT 
    customerID AS userID,
    printerID AS printerID,
    staffID AS printingStaffID,
    fileName AS fileName,
    startTime AS startTime,
    endTime AS endTime,
    numPages AS numberOfPage
FROM
    makeOrders AS m
        JOIN
    paymentLog AS p ON m.logID = p.id
        JOIN
    userOrders AS u ON m.orderID = u.id
        JOIN
    printingLog AS pl ON u.id = pl.orderID
        JOIN
    fileMetadata AS f ON pl.fileID = f.id;
END $$

CREATE PROCEDURE getOrderPagination(
	pageSize INT,
    offset INT
)
BEGIN
SELECT 
    m.customerID AS userID,
    printerID AS printerID,
    u.staffID AS printingStaffID,
    fileName AS fileName,
    startTime AS startTime,
    endTime AS endTime,
    numPages AS numberOfPage,
    CASE
        WHEN c.orderID IS NOT NULL THEN 'Cancelled'
        WHEN d.orderID IS NOT NULL THEN 'Declined'
        ELSE u.orderStatus
    END AS status
FROM
    makeOrders AS m
        LEFT JOIN
    paymentLog AS p ON m.logID = p.id
        LEFT JOIN
    userOrders AS u ON m.orderID = u.id
        LEFT JOIN
    printingLog AS pl ON u.id = pl.orderID
        LEFT JOIN
    fileMetadata AS f ON pl.fileID = f.id
        LEFT JOIN
    cancelOrders AS c ON m.orderID = c.orderID
        LEFT JOIN
    declineOrders AS d ON m.orderID = d.orderID
GROUP BY startTime , endTime , fileName , numberOfPage , printerID , printingStaffID , userID , status
ORDER BY startTime DESC
LIMIT pageSize OFFSET offset;
END $$

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

CREATE PROCEDURE getRecentlyMonthlyOrder(
	m INT,
    y INT
)
BEGIN
SELECT 
	DATE(paymentLog.paymentTime) AS Date,
	COUNT(*) AS OrderCount
FROM
	makeOrders
JOIN
	paymentLog ON makeOrders.logID = paymentLog.id
WHERE
	MONTH(paymentLog.paymentTime) = m
	AND YEAR(paymentLog.paymentTime) = y
GROUP BY DATE(paymentLog.paymentTime)
ORDER BY Date;
END $$

CREATE PROCEDURE getRecentlyMonthlyTransaction(
	m INT,
    y INT
)
BEGIN
SELECT
                DATE(paymentLog.paymentTime) AS Date, 
                COUNT(*) AS TransactionCount
            FROM 
                depositLog 
            JOIN 
                paymentLog ON depositLog.id = paymentLog.id
            WHERE
                MONTH(paymentLog.paymentTime) = m
                AND YEAR(paymentLog.paymentTime) = y
            GROUP BY DATE(paymentLog.paymentTime)
            ORDER BY Date;
END $$

CREATE PROCEDURE getRecentlyYearlyOrder(
	y INT
)
BEGIN
	SELECT 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m') AS MonthYear, 
                COUNT(*) AS OrderCount
            FROM 
                makeOrders 
            JOIN 
                paymentLog ON makeOrders.logID = paymentLog.id
            WHERE
                YEAR(paymentLog.paymentTime) = y 
            GROUP BY 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m')
            ORDER BY 
                MonthYear;
END $$
CREATE PROCEDURE getRecentlyYearlyTransaction(
	y INT
)
BEGIN
	SELECT 
                DATE_FORMAT(paymentLog.paymentTime, '%Y-%m') AS MonthYear,
                COUNT(*) AS TransactionCount
            FROM
                depositLog
            JOIN
                paymentLog ON depositLog.id = paymentLog.id
            WHERE
                YEAR(paymentLog.paymentTime) = y
            GROUP BY DATE_FORMAT(paymentLog.paymentTime, '%Y-%m')
            ORDER BY MonthYear;
END $$
CREATE PROCEDURE getTotalCancelOrderByMonth(
	m INT,
    y INT
)
BEGIN
SELECT 
                SUM(totalCanceledOrder) AS totalCanceledOrder
            FROM
                (SELECT 
                    COUNT(*) AS totalCanceledOrder
                FROM
                    cancelOrders 
                JOIN 
                    paymentLog ON cancelOrders.logID = paymentLog.id
                WHERE 
                    MONTH(paymentLog.paymentTime) = m
                    AND YEAR(paymentLog.paymentTime) = y
                UNION ALL 
                SELECT 
                    COUNT(*) AS totalCanceledOrder
                FROM
                    declineOrders 
                JOIN 
                    paymentLog ON declineOrders.logID = paymentLog.id
                WHERE 
                    MONTH(paymentLog.paymentTime) = m
                    AND YEAR(paymentLog.paymentTime) = y
                ) AS combined;
END $$
CREATE PROCEDURE getTotalCancelOrderByYear(
	y INT
)
BEGIN
SELECT 
                SUM(totalCanceledOrder) AS totalCanceledOrder
            FROM
                (SELECT 
                    COUNT(*) AS totalCanceledOrder
                FROM
                    cancelOrders 
                JOIN 
                    paymentLog ON cancelOrders.logID = paymentLog.id
                WHERE 
                    YEAR(paymentLog.paymentTime) = y
                UNION ALL 
                SELECT 
                    COUNT(*) AS totalCanceledOrder
                FROM
                    declineOrders 
                JOIN 
                    paymentLog ON declineOrders.logID = paymentLog.id
                WHERE 
                    YEAR(paymentLog.paymentTime) = y
                ) AS combined;
END $$
CREATE PROCEDURE getTransactionPagination(
	lmt INT,
    ost INT
)
BEGIN
SELECT 
                            customerID AS ID,
                            paymentTime AS dateOfTransaction,
                            SUM(depositCombo.quantity * combo.numCoins) AS coins,
                            SUM(depositCombo.quantity * combo.price) 	AS charge, 
                            method AS paymentMethod,
                            note
                        FROM
                            depositLog
                        JOIN
                            paymentLog ON depositLog.id = paymentLog.id
                        JOIN
                            depositCombo ON depositLog.id = depositCombo.logID
                        JOIN
                            combo ON depositCombo.comboID = combo.id
                        GROUP BY paymentLog.id
                        ORDER BY paymentTime DESC
                        LIMIT lmt OFFSET ost;
END $$
CREATE PROCEDURE GetPrintersBySPSO()
BEGIN
    SELECT 
        printer.id AS printer_id,
        printer.brand,
        printer.model,
        printer.printerDescription AS description,
        CONCAT(location.campus, " - ", location.building, " - ", location.room) AS location,
        printer.printerStatus AS status
    FROM printer
    JOIN location ON printer.locationID = location.id;
END$$



CREATE PROCEDURE AddManipulation(
    IN spsoID INT,
    IN printerID INT,
    IN spsoAction VARCHAR(20),
    IN actionTime DATETIME
)
BEGIN
    INSERT INTO manipulation (spsoID, printerID, spsoAction, actionTime)
    VALUES (spsoID, printerID, spsoAction, actionTime);
    SELECT LAST_INSERT_ID() AS manipulation_id;
END$$


CREATE PROCEDURE AddManage(
    IN spsoID INT,
    IN printerID INT
)
BEGIN
    INSERT INTO manage (spsoID, printerID)
    VALUES (spsoID, printerID);
    SELECT LAST_INSERT_ID() AS manage_id;
END$$


CREATE PROCEDURE find_or_add_manage(
    IN p_spsoID INT,
    IN p_printerID INT
)
BEGIN
    SELECT spsoID FROM manage WHERE  spsoID = p_spsoID AND printerID = p_printerID;
END$$


CREATE PROCEDURE AddPrinter(
    IN printerStatus VARCHAR(10),
    IN printerDescription VARCHAR(255),
    IN resolution VARCHAR(30),
    IN colorPrinting BOOL,
    IN side VARCHAR(20),
    IN price INT,
    IN model VARCHAR(50),
    IN speed INT,
    IN brand VARCHAR(50),
    IN wireless BOOL,
    IN printingMethod VARCHAR(20),
    IN locationID INT
)
BEGIN
    INSERT INTO printer 
    (printerStatus, printerDescription, resolution, colorPrinting, side, price, model, speed, brand, wireless, printingMethod, locationID)
    VALUES (printerStatus, printerDescription, resolution, colorPrinting, side, price, model, speed, brand, wireless, printingMethod, locationID);
    SELECT LAST_INSERT_ID() AS printer_id;
END$$

CREATE PROCEDURE UpdatePrinterStatus(
    IN printerStatus VARCHAR(20), 
    IN printerIds TEXT             
)
BEGIN
    SET @query = CONCAT('
        UPDATE printer 
        SET printerStatus = "', printerStatus, '" 
        WHERE id IN (', printerIds, ')
    ');

    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

CREATE PROCEDURE UpdatePrinter(
    IN printerId INT,
    IN printerStatus VARCHAR(10),
    IN printerDescription VARCHAR(255),
    IN resolution VARCHAR(30),
    IN colorPrinting BOOL,
    IN side VARCHAR(20),
    IN price INT,
    IN model VARCHAR(50),
    IN speed INT,
    IN brand VARCHAR(50),
    IN wireless BOOL,
    IN printingMethod VARCHAR(20),
    IN locationID INT
)
BEGIN
    UPDATE printer 
    SET 
        printerStatus = printerStatus, 
        printerDescription = printerDescription, 
        resolution = resolution, 
        colorPrinting = colorPrinting, 
        side = side, 
        price = price, 
        model = model, 
        speed = speed, 
        brand = brand, 
        wireless = wireless, 
        printingMethod = printingMethod, 
        locationID = locationID
    WHERE id = printerId;
END$$


CREATE PROCEDURE GetPrintersByIds(
    IN printerIds TEXT
)
BEGIN
    SET @query = CONCAT(
        'SELECT 
            printer.id AS printer_id,
            printer.brand,
            printer.model,
            printer.printerStatus AS status,
            location.campus,
            location.building,
            location.room,
            printer.printerDescription AS description,
            printer.resolution,
            printer.colorPrinting AS color,
            printer.side AS oneTwoSide,
            printer.price,
            printer.speed,
            printer.wireless AS wirelessConnection,
            printer.printingMethod
        FROM printer
        JOIN location ON printer.locationID = location.id
        WHERE printer.id IN (', printerIds, ')'
    );

    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

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
END $$


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
END $$

CREATE PROCEDURE LoadCombo() 
BEGIN
    SELECT * FROM combo;
END $$

CREATE TRIGGER increase_pk_combo
BEFORE INSERT ON combo
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(255);
    SET new_id = CONCAT('CB', LPAD(IFNULL((SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) FROM combo), 0) + 1, 4, '0'));
    SET NEW.id = new_id;
END $$

CREATE PROCEDURE `addOrder`(
    p_orderStatus VARCHAR(50),
    p_orderData TIMESTAMP,
    p_printerID INT
)
BEGIN
    INSERT INTO userOrders (orderStatus, orderDate, printerID) VALUES (p_orderStatus, p_orderData, p_printerID);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$



CREATE PROCEDURE `getOrderByPrinterID`(
    p_printerID INT
)
BEGIN
    SELECT * FROM userOrders WHERE printerID = p_printerID AND lower(orderStatus) = 'pending';
END$$



CREATE PROCEDURE `updateOrderStatus`(
    p_id INT,
    p_orderStatus VARCHAR(50)
)
BEGIN
    UPDATE userOrders SET orderStatus = p_orderStatus WHERE id = p_id;
END$$



CREATE PROCEDURE `updateOrderCompleteTime`(
    p_id INT
)
BEGIN
    UPDATE userOrders SET orderStatus = 'Completed', completeTime = CURRENT_TIMESTAMP() WHERE id = p_id;
END$$



CREATE PROCEDURE `updateOrderStaffID`(
    p_id INT,
    p_staffID INT
)
BEGIN
    UPDATE userOrders SET staffID = p_staffID WHERE id = p_id;
END$$



CREATE PROCEDURE `addPackage`(
    p_numOfCopies INT, 
    p_side VARCHAR(1), 
    p_colorAllPages BOOL, 
    p_pagePerSheet INT, 
    p_paperSize VARCHAR(10), 
    p_scale DOUBLE, 
    p_cover BOOL, 
    p_glass BOOL, 
    p_binding BOOL, 
    p_orderID INT, 
    p_colorCover BOOL
)
BEGIN
    INSERT INTO package (numOfCopies, side, colorAllPages, pagePerSheet, paperSize, scale, cover, glass, binding, orderID, colorCover) VALUES (p_numOfCopies, p_side, p_colorAllPages, p_pagePerSheet, p_paperSize, p_scale, p_cover, p_glass,p_binding, p_orderID, p_colorCover);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$



CREATE PROCEDURE `getPackageByOrderID`(
    p_orderID INT
)
BEGIN
    SELECT * FROM package WHERE orderID = p_orderID;
END$$



CREATE PROCEDURE `addPackagePrintingPages`(
    p_packageID INT, 
    p_color BOOL, 
    p_fromPage INT, 
    p_toPage INT, 
    p_orientation VARCHAR(20)
)
BEGIN
    INSERT INTO packagePrintingPages (packageID, color, fromPage, toPage, orientation) VALUES (p_packageID, p_color, p_fromPage, p_toPage, p_orientation);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$



CREATE PROCEDURE `getPackagePrintingPagesByPackageID`(
    p_packageID INT
)
BEGIN
    SELECT * FROM packagePrintingPages WHERE packageID = p_packageID;
END$$



CREATE PROCEDURE `addFileMetadata`(
    p_fileName VARCHAR(255),
    p_size DOUBLE,
    p_numPages INT,
    p_url VARCHAR(255),
    p_packageID INT
)
BEGIN
    INSERT INTO fileMetadata (fileName, size, numPages, url, packageID) VALUES (p_fileName, p_size, p_numPages, p_url, p_packageID);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$



CREATE PROCEDURE `getFileMetadataByPackageID`(
    p_packageID INT
)
BEGIN
    SELECT * FROM fileMetadata WHERE packageID = p_packageID;
END$$



CREATE PROCEDURE `addPaymentLog`(
    p_paymentTime TIMESTAMP,
    p_money INT
)
BEGIN
    INSERT INTO paymentLog (paymentTime, money) VALUES (p_paymentTime, p_money);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$



CREATE PROCEDURE `addWithdrawLog`(
    p_id INT
)
BEGIN
    INSERT INTO withdrawLog (id) VALUES (p_id);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$



CREATE PROCEDURE `addReturnLog`(
    p_id INT
)
BEGIN
    INSERT INTO returnLog (id) VALUES (p_id);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$



CREATE PROCEDURE `addMakeOrders`(
    p_customerID INT,
    p_orderID INT, 
    p_logID INT, 
    p_note VARCHAR(255)
)
BEGIN
    INSERT INTO makeOrders (customerID, orderID, logID, note) VALUES (p_customerID, p_orderID, p_logID, p_note);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$

CREATE PROCEDURE `addCancelOrders`(
    p_customerID INT,
    p_orderID INT, 
    p_logID INT, 
    p_note VARCHAR(255)
)
BEGIN
    INSERT INTO cancelOrders (customerID, orderID, logID, note) VALUES (p_customerID, p_orderID, p_logID, p_note);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$


CREATE PROCEDURE `addDeclineOrders`(
    p_staffID INT,
    p_orderID INT, 
    p_logID INT, 
    p_note VARCHAR(255)
)
BEGIN
    INSERT INTO declineOrders (staffID, orderID, logID, note) VALUES (p_staffID, p_orderID, p_logID, p_note);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$

CREATE PROCEDURE `getAllActivePrinter`(
    p_printerStatus VARCHAR(10),
    p_colorPrinting BOOL
)
BEGIN
    SELECT printer.id AS id, printingMethod, campus, building, room FROM printer JOIN location ON locationID = location.id WHERE lower(printerStatus) = p_printerStatus AND colorPrinting = p_colorPrinting;
END$$


CREATE PROCEDURE `getCustomer`(
    p_id INT
)
BEGIN
    SELECT * FROM customer WHERE id = p_id;
END$$

CREATE PROCEDURE `getPrinterByStaffID`(
    p_staffID INT
)
BEGIN
    SELECT * FROM operatedBy JOIN printer ON id = printerID WHERE staffID = p_staffID;
END$$

CREATE PROCEDURE `decreaseCustomerBalance`(
    p_id INT,
    p_amount DOUBLE
)
BEGIN
    UPDATE customer SET balance = balance - p_amount  WHERE id = p_id;
END$$

CREATE PROCEDURE `increaseCustomerBalance`(
    p_id INT,
    p_amount DOUBLE
)
BEGIN
    UPDATE customer SET balance = balance + p_amount  WHERE id = p_id;
END$$

CREATE PROCEDURE `getOrderCost`(
    p_orderID INT
)
BEGIN
    SELECT * FROM makeOrders JOIN paymentLog ON logID = id where orderID = p_orderID;
END$$

CREATE PROCEDURE `addPrintingLog`(
    p_orderID INT,
    p_logNumber INT, 
    p_startTime TIMESTAMP, 
    p_fileID INT
)
BEGIN
    INSERT INTO printingLog (orderID, 
    logNumber, startTime, fileID) VALUES (p_orderID, p_logNumber, p_startTime, p_fileID);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$

CREATE PROCEDURE `updatePrintingLogEndTime`(
    p_fileID INT,
    p_endTime TIMESTAMP
)
BEGIN
    UPDATE printingLog SET endTime = p_endTime WHERE fileID = p_fileID;
END$$

CREATE PROCEDURE UpdateCustomerBalance(
    IN customerId INT,
    IN addedBalance INT
)
BEGIN
    DECLARE currentBalance INT;
    DECLARE isSuccess BOOL;

    -- Kiểm tra khách hàng có tồn tại hay không
    SELECT balance INTO currentBalance
    FROM customer
    WHERE id = customerId;

    IF currentBalance IS NULL THEN
        -- Nếu không tìm thấy khách hàng, đặt isSuccess là FALSE
        SET isSuccess = FALSE;
    ELSE
        -- Tính toán số dư mới
        SET currentBalance = currentBalance + addedBalance;

        -- Cập nhật số dư
        UPDATE customer
        SET balance = currentBalance
        WHERE id = customerId;

        -- Đặt isSuccess là TRUE
        SET isSuccess = TRUE;
    END IF;

    SELECT isSuccess as isSuccess;
END$$

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


CREATE PROCEDURE userSearchTransaction (
	IN cID INT,
    IN param VARCHAR(255)
)
BEGIN
IF param IS NOT NULL THEN
SELECT
        date_of_transaction, number_of_coins, method, combo_list, charge, note
    FROM
    (
        -- Deposit Log transactions
        SELECT 
            p.paymentTime AS date_of_transaction,
            SUM(c.numCoins) AS number_of_coins,
            d.method AS method,
            GROUP_CONCAT(dc.comboID) AS combo_list,
            p.money AS charge,
            d.note AS note
        FROM
            depositLog AS d
            JOIN paymentLog AS p ON d.id = p.id
            LEFT JOIN depositCombo AS dc ON d.id = dc.logID
            LEFT JOIN combo AS c ON c.id = dc.comboID
        WHERE
            d.customerID = cID
        GROUP BY p.paymentTime, d.method, d.note, p.money

        UNION ALL

        -- Make Order transactions
        SELECT 
            p.paymentTime AS date_of_transaction,
            p.money AS number_of_coins,
            'Make Order' AS method,
            'NULL' AS combo_list,
            'NULL' AS charge,
            m.note AS note
        FROM 
            paymentLog AS p
            JOIN makeOrders AS m ON p.id = m.logID
        WHERE
            m.customerID = cID
        GROUP BY p.paymentTime, p.money, m.note

        UNION ALL

        -- Cancel Order transactions
        SELECT 
            p.paymentTime AS date_of_transaction,
            p.money AS number_of_coins,
            'Cancel Order' AS method,
            'NULL' AS combo_list,
            'NULL' AS charge,
            c.note AS note
        FROM 
            paymentLog AS p
            JOIN cancelOrders AS c ON p.id = c.logID
        WHERE
            c.customerID = cID
        GROUP BY p.paymentTime, p.money, c.note
    ) AS combined_transactions
		WHERE note LIKE CONCAT('%', param, '%') 
			OR method LIKE CONCAT('%', param, '%') 
			OR combo_list LIKE CONCAT('%', param, '%')
    ORDER BY date_of_transaction DESC;
ELSE
	SELECT
        date_of_transaction, number_of_coins, method, combo_list, charge, note
    FROM
    (
        -- Deposit Log transactions
        SELECT 
            p.paymentTime AS date_of_transaction,
            SUM(c.numCoins) AS number_of_coins,
            d.method AS method,
            GROUP_CONCAT(dc.comboID) AS combo_list,
            p.money AS charge,
            d.note AS note
        FROM
            depositLog AS d
            JOIN paymentLog AS p ON d.id = p.id
            LEFT JOIN depositCombo AS dc ON d.id = dc.logID
            LEFT JOIN combo AS c ON c.id = dc.comboID
        WHERE
            d.customerID = cID
        GROUP BY p.paymentTime, d.method, d.note, p.money

        UNION ALL

        -- Make Order transactions
        SELECT 
            p.paymentTime AS date_of_transaction,
            p.money AS number_of_coins,
            'Make Order' AS method,
            'NULL' AS combo_list,
            'NULL' AS charge,
            m.note AS note
        FROM 
            paymentLog AS p
            JOIN makeOrders AS m ON p.id = m.logID
        WHERE
            m.customerID = cID
        GROUP BY p.paymentTime, p.money, m.note

        UNION ALL

        -- Cancel Order transactions
        SELECT 
            p.paymentTime AS date_of_transaction,
            p.money AS number_of_coins,
            'Cancel Order' AS method,
            'NULL' AS combo_list,
            'NULL' AS charge,
            c.note AS note
        FROM 
            paymentLog AS p
            JOIN cancelOrders AS c ON p.id = c.logID
        WHERE
            c.customerID = cID
        GROUP BY p.paymentTime, p.money, c.note
    ) AS combined_transactions
    ORDER BY date_of_transaction DESC;
END IF;
END $$

CREATE PROCEDURE SearchUserOrder(
    IN customerID INT,
    IN param VARCHAR(255)
)
BEGIN
    IF param IS NULL THEN
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
        FROM
            userOrders AS u
                LEFT JOIN makeOrders AS m 
                ON u.id = m.orderID AND m.customerID = customerID
                LEFT JOIN declineOrders AS d 
                ON u.id = d.orderID
                LEFT JOIN cancelOrders AS c 
                ON u.id = c.orderID AND c.customerID = customerID
        WHERE
            (m.customerID = customerID OR c.customerID = customerID)
        ORDER BY orderDate DESC;
    ELSE
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
        FROM
            userOrders AS u
                LEFT JOIN makeOrders AS m 
                ON u.id = m.orderID AND m.customerID = customerID
                LEFT JOIN declineOrders AS d 
                ON u.id = d.orderID
                LEFT JOIN cancelOrders AS c 
                ON u.id = c.orderID AND c.customerID = customerID
        WHERE
            (m.customerID = customerID OR c.customerID = customerID)
            AND (
                COALESCE(c.note, m.note) LIKE CONCAT('%', param, '%')
                OR CAST(u.id AS CHAR) LIKE param
                OR u.orderStatus LIKE param
            )
        ORDER BY orderDate DESC;
    END IF;
END $$

DELIMITER ;