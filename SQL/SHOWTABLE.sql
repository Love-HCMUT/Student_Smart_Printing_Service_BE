DROP DATABASE IF EXISTS newssps;
CREATE DATABASE newssps;
USE newssps;

CREATE TABLE location (
  id INT NOT NULL AUTO_INCREMENT,
  campus varchar(20) NOT NULL,
  building varchar(20) NOT NULL,
  room varchar(20) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE printer (
  id INT NOT NULL AUTO_INCREMENT,
  printerStatus varchar(10) DEFAULT NULL,
  printerDescription varchar(255) DEFAULT NULL,
  resolution varchar(30) DEFAULT NULL,
  colorPrinting TINYINT(1) DEFAULT NULL,
  side enum('1','2') DEFAULT NULL,
  price INT DEFAULT NULL,
  model varchar(50) DEFAULT NULL,
  speed INT DEFAULT NULL,
  brand varchar(50) DEFAULT NULL,
  wireless TINYINT(1) DEFAULT NULL,
  printingMethod varchar(20) DEFAULT NULL,
  locationID INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY locationID (locationID)
);

CREATE TABLE account (
  id INT NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL,
  accountPassword varchar(100) NOT NULL,
  fullName varchar(100) DEFAULT NULL,
  roles varchar(20) NOT NULL DEFAULT 'user',
  PRIMARY KEY (id),
  UNIQUE KEY username (username)
);

CREATE TABLE spso (
  id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE spsoPhoneNumbers (
  id INT NOT NULL,
  phoneNumber varchar(20) NOT NULL,
  PRIMARY KEY (id,phoneNumber)
);

CREATE TABLE manage (
  spsoID INT NOT NULL,
  printerID INT NOT NULL,
  PRIMARY KEY (spsoID,printerID),
  KEY printerID (printerID)
);

CREATE TABLE manipulation (
  spsoID INT NOT NULL,
  printerID INT NOT NULL,
  spsoAction varchar(20) NOT NULL,
  actionTime timestamp NOT NULL,
  PRIMARY KEY (spsoID,printerID,spsoAction,actionTime)
);

CREATE TABLE customer (
  id INT NOT NULL,
  balance INT DEFAULT '0',
  PRIMARY KEY (id)
);

CREATE TABLE staff (
  id INT NOT NULL,
  locationID INT NOT NULL,
  spsoID INT NOT NULL,
  mentorID INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY locationID (locationID),
  KEY spsoID (spsoID),
  KEY mentorID (mentorID)
);

CREATE TABLE staffPhoneNumbers (
  id INT NOT NULL,
  phoneNumber varchar(20) NOT NULL,
  PRIMARY KEY (id,phoneNumber)
);

CREATE TABLE operatedBy (
  printerID INT NOT NULL,
  staffID INT NOT NULL,
  PRIMARY KEY (printerID,staffID),
  KEY staffID (staffID)
);

CREATE TABLE repairedBy (
  printerID INT NOT NULL,
  staffID INT NOT NULL,
  repairDate timestamp NULL DEFAULT NULL,
  cost INT DEFAULT NULL,
  errorInfo varchar(255) DEFAULT NULL,
  PRIMARY KEY (printerID,staffID),
  KEY staffID (staffID)
);

CREATE TABLE userOrders (
  id INT NOT NULL AUTO_INCREMENT,
  orderStatus varchar(50) DEFAULT NULL,
  orderDate timestamp NULL DEFAULT NULL,
  completeTime timestamp NULL DEFAULT NULL,
  printerID INT DEFAULT NULL,
  staffID INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY printerID (printerID),
  KEY staffID (staffID)
);

CREATE TABLE package (
  id INT NOT NULL AUTO_INCREMENT,
  numOfCopies INT DEFAULT NULL,
  side enum('1','2') DEFAULT NULL,
  colorAllPages TINYINT(1) DEFAULT NULL,
  pagePerSheet INT DEFAULT NULL,
  paperSize varchar(10) DEFAULT NULL,
  scale double DEFAULT NULL,
  cover TINYINT(1) DEFAULT NULL,
  glass TINYINT(1) DEFAULT NULL,
  binding TINYINT(1) DEFAULT NULL,
  orderID INT DEFAULT NULL,
  colorCover TINYINT(1) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY orderID (orderID)
);

CREATE TABLE packagePrintingPages (
  packageID INT NOT NULL,
  color TINYINT(1) NOT NULL,
  fromPage INT NOT NULL,
  toPage INT NOT NULL,
  orientation varchar(20) NOT NULL,
  PRIMARY KEY (packageID,color,fromPage,toPage,orientation)
);

CREATE TABLE fileMetadata (
  id INT NOT NULL AUTO_INCREMENT,
  fileName varchar(255) NOT NULL,
  size double DEFAULT NULL,
  numPages INT DEFAULT NULL,
  url varchar(255) DEFAULT NULL,
  packageID INT DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY url (url),
  KEY packageID (packageID)
);

CREATE TABLE printingLog (
  orderID INT NOT NULL,
  logNumber INT NOT NULL,
  startTime timestamp NULL DEFAULT NULL,
  endTime timestamp NULL DEFAULT NULL,
  fileID INT DEFAULT NULL,
  PRIMARY KEY (orderID,logNumber),
  KEY fileID (fileID)
);

CREATE TABLE combo (
  id varchar(255) NOT NULL,
  price INT DEFAULT NULL,
  numCoins INT DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE paymentLog (
  id INT NOT NULL AUTO_INCREMENT,
  paymentTime timestamp NOT NULL,
  money INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE depositLog (
  id INT NOT NULL,
  method varchar(50) DEFAULT NULL,
  note varchar(255) DEFAULT NULL,
  customerID INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY customerID (customerID)
);

CREATE TABLE depositCombo (
  logID INT NOT NULL,
  comboID varchar(255) NOT NULL,
  quantity INT DEFAULT NULL,
  PRIMARY KEY (logID,comboID)
);

CREATE TABLE returnLog (
  id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE withdrawLog (
  id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE makeOrders (
  customerID INT NOT NULL,
  orderID INT NOT NULL,
  logID INT NOT NULL,
  note varchar(255) DEFAULT NULL,
  PRIMARY KEY (customerID,orderID),
  KEY orderID (orderID),
  KEY logID (logID)
);

CREATE TABLE cancelOrders (
  customerID INT NOT NULL,
  orderID INT NOT NULL,
  logID INT NOT NULL,
  note varchar(255) DEFAULT NULL,
  PRIMARY KEY (customerID,orderID),
  KEY orderID (orderID),
  KEY logID (logID)
);

CREATE TABLE declineOrders (
  staffID INT NOT NULL,
  orderID INT NOT NULL,
  logID INT NOT NULL,
  note varchar(255) DEFAULT NULL,
  PRIMARY KEY (staffID,orderID),
  KEY orderID (orderID),
  KEY logID (logID)
);

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

INSERT INTO location(campus, building, room) VALUES
('HCMUT', 'H1', '101'),
('HCMUT', 'H2', '203'),
('HCMUT', 'H7', '101'),
('HCMUT', 'H5', '501');

INSERT INTO printer (printerStatus, printerDescription, resolution, colorPrinting, side, price, model, speed, brand, wireless, printingMethod, locationID) VALUES
('Available', 'High-speed printer', '600dpi', 1, '2', 150, 'Model X', 30, 'Brand A', 1, 'Laser', 1),
('Unavailabl', 'Standard printer', '300dpi', 0, '1', 100, 'Model Y', 20, 'Brand B', 0, 'Inkjet', 2),
('Available', 'Office printer', '1200dpi', 1, '2', 200, 'Model Z', 25, 'Brand C', 1, 'Laser', 3),
('Unavailabl', 'Compact printer', '600dpi', 0, '1', 80, 'Model W', 15, 'Brand D', 0, 'Inkjet', 4),
('Available', 'High-volume printer', '1200dpi', 1, '2', 300, 'Model V', 35, 'Brand E', 1, 'Laser', 1),
('Available', 'Photo printer', '2400dpi', 1, '1', 250, 'Model U', 10, 'Brand F', 1, 'Thermal', 2);

INSERT INTO account (username, accountPassword, fullName, roles) VALUES
('HoGiaThang00', '$2b$10$lkzdlp/GEd.QdpiWcO.I/uL5TEVYhgfJpxWUH4QMlHhYFWwMm0E66', 'Ho Gia THang', 'Printing Staff'),    -- Password123
('TranLam01', '$2b$10$Kv6eW3SmMgEnZE6Yp9/Iy.Nb4WCFd4Myxic0K47807fM130MmUB4G', 'Tran Lam', 'SPSO'),			  		-- SecurePass456
('DuongHaiLam10', '$2b$10$X.XAhqKBwWsmTySClJTIw.GlC8iMgzYQcGGksO2dQrDWL7m48joqq', 'Duong Hai Lam', 'Printing Staff'),	-- MyPassword789
('PhanTuanKiet11', '$2b$10$PfHHGYXTk2x0nhQyrwprdeRq6bq083WyWyDvZ8dyrUcFc1oQh3.UK', 'Phan Tuan Kiet', 'User'),         	-- AnotherPass012
('NguyenVanT24', '$2b$10$WaOZwQJQpnRzxyX0Aj7CMOQDt1phzOWWSGvwVUBHwQ7Bqy..OwZuW', 'Nguyen Van T', 'SPSO'),        		-- FinalPass345
('NgoDinhT46', '$2b$10$TeOwi3y4w3RoLlzaIshIkev0Q.k/D52zKlAATSoq2Mn98hj4qQYXa', 'Ngo Dinh D', 'User'),  				-- Top1SeverMienNam
('NguoiHamMo33', '$2b$10$ccYOfgjrpfMSd59t4PI1muvBgER16lITCH1FEkpvCzsPpDTte0DPe', 'Nguyen Xuan C', 'User'), 			-- Top1SeverMienBac
('NguoiThoiLua44', '$2b$10$9TvAO6ee5rv0Iu45iR8ZDeLqRBLy47LB7k0pQ4gua55Bri0jR3Aie', 'Le Van Bao', 'User'),     			-- Top1SeverChauAu
('RonDemon1234', '$2b$10$lkzdlp/GEd.QdpiWcO.I/uL5TEVYhgfJpxWUH4QMlHhYFWwMm0E66', 'Phan Van Diot', 'Printing Staff'),     -- Password123
('RoyCanon2946', '$2b$10$lkzdlp/GEd.QdpiWcO.I/uL5TEVYhgfJpxWUH4QMlHhYFWwMm0E66', 'Le Dinh T', 'Printing Staff');   -- FinalPass345

INSERT INTO spso(id) VALUES
(2),
(5);

INSERT INTO spsoPhoneNumbers(id, phoneNumber) VALUES
(2, '0901156009'),
(2, '0387674221'),
(5, '0987654321'),
(5, '0332194924');

INSERT INTO manage (spsoID, printerID) VALUES
(2, 1),
(2, 2),
(2, 4),
(5, 3),
(5, 5),
(5, 6);

INSERT INTO manipulation (spsoID, printerID, spsoAction, actionTime) VALUES
(2, 1, 'Add printer', '2023-12-12 10:00:00'),
(2, 2, 'Add printer', '2023-12-12 11:00:00'),
(5, 3, 'Add printer', '2023-12-12 12:00:00'),
(2, 4, 'Add printer', '2023-12-12 13:00:00'),
(5, 5, 'Add printer', '2023-12-12 14:00:00'),
(5, 6, 'Add printer', '2023-12-12 15:00:00'),
(2, 1, 'Repair printer', '2023-12-12 16:00:00'),
(2, 2, 'Repair printer', '2023-12-12 17:00:00'),
(5, 3, 'Repair printer', '2023-12-12 18:00:00');

INSERT INTO customer (id, balance) VALUES
(1, 10000),
(4, 20000),
(6, 30000),
(8, 50000);

INSERT INTO staff (id, locationID, spsoID, mentorID) VALUES
(1, 2, 2, NULL),
(3, 1, 2, NULL),
(9, 3, 5, NULL),
(10, 4, 5, NULL);

INSERT INTO staffPhoneNumbers (id, phoneNumber) VALUES
(1, '1234567890'),
(3, '0987654321'),
(9, '1122334455'),
(10, '5566778899');

INSERT INTO operatedBy (printerID, staffID) VALUES
(1, 1),
(2, 3),
(3, 9),
(4, 10),
(5, 1),
(6, 3);

INSERT INTO repairedBy (printerID, staffID, repairDate, cost, errorInfo) VALUES
(1, 1, '2024-01-15 10:00:00', 100, 'Paper jam'),
(2, 3, '2024-03-12 11:00:00', 150, 'Ink leakage'),
(3, 9, '2024-04-03 12:00:00', 200, 'Drum replacement'),
(4, 10, '2024-05-04 13:00:00', 120, 'Software update'),
(5, 1, '2024-06-09 14:00:00', 180, 'Power issue'),
(6, 3, '2024-07-25 15:00:00', 160, 'Network connectivity');

INSERT INTO userOrders (orderStatus, orderDate, completeTime, printerID, staffID) VALUES
('Processing', '2024-01-10 09:00:00', '2024-01-10 10:00:00', 1, 1),
('Completed', '2024-01-15 11:00:00', '2024-01-15 12:00:00', 2, 3),
('Cancelled', '2024-02-10 13:00:00', NULL, 3, 9),
('Processing', '2024-03-05 14:00:00', '2024-03-05 15:00:00', 4, 10),
('Completed', '2024-04-01 16:00:00', '2024-04-01 17:00:00', 5, 1),
('Cancelled', '2024-04-20 18:00:00', NULL, 6, 3),
('Processing', '2024-05-10 09:00:00', '2024-05-10 10:00:00', 1, 1),
('Completed', '2024-06-15 11:00:00', '2024-06-15 12:00:00', 2, 3),
('Cancelled', '2024-07-12 13:00:00', NULL, 3, 9),
('Processing', '2024-08-20 14:00:00', '2024-08-20 15:00:00', 4, 10),
('Completed', '2024-09-11 16:00:00', '2024-09-11 17:00:00', 5, 1),
('Cancelled', '2024-10-13 18:00:00', NULL, 6, 3),
('Processing', '2024-11-15 09:00:00', '2024-11-15 10:00:00', 1, 1),
('Completed', '2024-12-10 11:00:00', '2024-12-10 12:00:00', 2, 3),
('Cancelled', '2024-12-11 13:00:00', NULL, 3, 9),
('Processing', '2024-12-12 14:00:00', '2024-12-12 15:00:00', 1, 1),
('Completed', '2024-12-13 16:00:00', '2024-12-13 17:00:00', 2, 3),
('Cancelled', '2024-12-14 18:00:00', NULL, 3, 9),
('Processing', '2024-12-15 09:00:00', '2024-12-15 10:00:00', 4, 10),
('Completed', '2024-12-16 11:00:00', '2024-12-16 12:00:00', 5, 1),
('Processing', '2024-12-17 13:00:00', '2024-12-17 14:00:00', 6, 3),
('Processing', '2024-12-18 14:00:00', '2024-12-18 15:00:00', 1, 1),
('Completed', '2024-12-19 16:00:00', '2024-12-19 17:00:00', 2, 3),
('Cancelled', '2024-12-20 18:00:00', NULL, 3, 9),
('Processing', '2024-12-21 09:00:00', '2024-12-21 10:00:00', 4, 10),
('Completed', '2024-12-22 11:00:00', '2024-12-22 12:00:00', 5, 1),
('Processing', '2024-12-23 13:00:00', '2024-12-23 14:00:00', 6, 3),
('Processing', '2024-12-24 14:00:00', '2024-12-24 15:00:00', 1, 1),
('Completed', '2024-12-25 16:00:00', '2024-12-25 17:00:00', 2, 3),
('Cancelled', '2024-12-26 18:00:00', NULL, 3, 9),
('Processing', '2024-12-27 09:00:00', '2024-12-27 10:00:00', 4, 10),
('Completed', '2024-12-28 11:00:00', '2024-12-28 12:00:00', 5, 1),
('Processing', '2024-12-29 13:00:00', '2024-12-29 14:00:00', 6, 3),
('Processing', '2024-12-30 14:00:00', '2024-12-30 15:00:00', 1, 1),
('Completed', '2024-12-31 16:00:00', '2024-12-31 17:00:00', 2, 3),
('Cancelled', '2025-01-01 18:00:00', NULL, 3, 9),
('Processing', '2025-01-02 09:00:00', '2025-01-02 10:00:00', 4, 10),
('Completed', '2025-01-03 11:00:00', '2025-01-03 12:00:00', 5, 1),
('Cancelled', '2025-01-04 13:00:00', NULL, 6, 3),
('Processing', '2025-01-05 14:00:00', '2025-01-05 15:00:00', 1, 1),
('Completed', '2025-01-06 16:00:00', '2025-01-06 17:00:00', 2, 3),
('Cancelled', '2025-01-07 18:00:00', NULL, 3, 9),
('Processing', '2025-01-08 09:00:00', '2025-01-08 10:00:00', 4, 10),
('Completed', '2025-01-09 11:00:00', '2025-01-09 12:00:00', 5, 1),
('Cancelled', '2025-01-10 13:00:00', NULL, 6, 3),
('Processing', '2025-01-11 14:00:00', '2025-01-11 15:00:00', 1, 1),
('Completed', '2025-01-12 16:00:00', '2025-01-12 17:00:00', 2, 3);

INSERT INTO package (numOfCopies, side, colorAllPages, pagePerSheet, paperSize, scale, cover, glass, binding, orderID, colorCover) VALUES
(10, '1', 1, 1, 'A4', 1.0, 1, 0, 1, 1, 1),
(20, '2', 0, 2, 'A3', 0.5, 0, 1, 0, 2, 0),
(15, '1', 1, 4, 'A5', 1.5, 1, 0, 1, 3, 1),
(25, '2', 0, 1, 'A4', 1.0, 0, 1, 0, 4, 0),
(30, '1', 1, 2, 'A3', 0.75, 1, 0, 1, 5, 1),
(12, '2', 0, 4, 'A5', 1.25, 0, 1, 0, 6, 0),
(18, '1', 1, 1, 'A4', 1.0, 1, 0, 1, 7, 1),
(22, '2', 0, 2, 'A3', 0.5, 0, 1, 0, 8, 0),
(16, '1', 1, 4, 'A5', 1.5, 1, 0, 1, 9, 1),
(24, '2', 0, 1, 'A4', 1.0, 0, 1, 0, 10, 0),
(28, '1', 1, 2, 'A3', 0.75, 1, 0, 1, 11, 1),
(14, '2', 0, 4, 'A5', 1.25, 0, 1, 0, 12, 0),
(20, '1', 1, 1, 'A4', 1.0, 1, 0, 1, 13, 1),
(26, '2', 0, 2, 'A3', 0.5, 0, 1, 0, 14, 0),
(18, '1', 1, 4, 'A5', 1.5, 1, 0, 1, 15, 1),
(25, '2', 0, 1, 'A4', 1.0, 0, 1, 0, 16, 0),
(30, '1', 1, 2, 'A3', 0.75, 1, 0, 1, 17, 1),
(15, '2', 0, 4, 'A5', 1.25, 0, 1, 0, 18, 0),
(21, '1', 1, 1, 'A4', 1.0, 1, 0, 1, 19, 1),
(27, '2', 0, 2, 'A3', 0.5, 0, 1, 0, 20, 0),
(19, '1', 1, 4, 'A5', 1.5, 1, 0, 1, 21, 1),
(23, '2', 0, 1, 'A4', 1.0, 0, 1, 0, 22, 0),
(29, '1', 1, 2, 'A3', 0.75, 1, 0, 1, 23, 1),
(13, '2', 0, 4, 'A5', 1.25, 0, 1, 0, 24, 0),
(17, '1', 1, 1, 'A4', 1.0, 1, 0, 1, 25, 1),
(22, '2', 0, 2, 'A3', 0.5, 0, 1, 0, 26, 0),
(16, '1', 1, 4, 'A5', 1.5, 1, 0, 1, 27, 1),
(24, '2', 0, 1, 'A4', 1.0, 0, 1, 0, 28, 0),
(28, '1', 1, 2, 'A3', 0.75, 1, 0, 1, 29, 1),
(14, '2', 0, 4, 'A5', 1.25, 0, 1, 0, 30, 0);

INSERT INTO packagePrintingPages (packageID, color, fromPage, toPage, orientation) VALUES
(1, 1, 1, 10, 'Portrait'),
(2, 0, 1, 20, 'Landscape'),
(3, 1, 1, 15, 'Portrait'),
(4, 0, 1, 25, 'Landscape'),
(5, 1, 1, 30, 'Portrait'),
(6, 0, 1, 12, 'Landscape'),
(7, 1, 1, 18, 'Portrait'),
(8, 0, 1, 22, 'Landscape'),
(9, 1, 1, 16, 'Portrait'),
(10, 0, 1, 24, 'Landscape'),
(11, 1, 1, 28, 'Portrait'),
(12, 0, 1, 14, 'Landscape'),
(13, 1, 1, 20, 'Portrait'),
(14, 0, 1, 26, 'Landscape'),
(15, 1, 1, 18, 'Portrait'),
(16, 0, 1, 25, 'Landscape'),
(17, 1, 1, 30, 'Portrait'),
(18, 0, 1, 15, 'Landscape'),
(19, 1, 1, 21, 'Portrait'),
(20, 0, 1, 27, 'Landscape'),
(21, 1, 1, 19, 'Portrait'),
(22, 0, 1, 23, 'Landscape'),
(23, 1, 1, 29, 'Portrait'),
(24, 0, 1, 13, 'Landscape'),
(25, 1, 1, 17, 'Portrait'),
(26, 0, 1, 22, 'Landscape'),
(27, 1, 1, 16, 'Portrait'),
(28, 0, 1, 24, 'Landscape'),
(29, 1, 1, 28, 'Portrait'),
(30, 0, 1, 14, 'Landscape');

INSERT INTO fileMetadata (fileName, size, numPages, url, packageID) VALUES
('file1.pdf', 1.2, 10, 'http://example.com/file1.pdf', 1),
('file2.pdf', 2.5, 20, 'http://example.com/file2.pdf', 2),
('file3.pdf', 1.8, 15, 'http://example.com/file3.pdf', 3),
('file4.pdf', 3.0, 25, 'http://example.com/file4.pdf', 4),
('file5.pdf', 2.7, 30, 'http://example.com/file5.pdf', 5),
('file6.pdf', 1.1, 12, 'http://example.com/file6.pdf', 6),
('file7.pdf', 1.5, 18, 'http://example.com/file7.pdf', 7),
('file8.pdf', 2.2, 22, 'http://example.com/file8.pdf', 8),
('file9.pdf', 1.4, 16, 'http://example.com/file9.pdf', 9),
('file10.pdf', 2.8, 24, 'http://example.com/file10.pdf', 10),
('file11.pdf', 3.2, 28, 'http://example.com/file11.pdf', 11),
('file12.pdf', 1.3, 14, 'http://example.com/file12.pdf', 12),
('file13.pdf', 2.0, 20, 'http://example.com/file13.pdf', 13),
('file14.pdf', 2.6, 26, 'http://example.com/file14.pdf', 14),
('file15.pdf', 1.7, 18, 'http://example.com/file15.pdf', 15),
('file16.pdf', 3.1, 25, 'http://example.com/file16.pdf', 16),
('file17.pdf', 2.9, 30, 'http://example.com/file17.pdf', 17),
('file18.pdf', 1.6, 15, 'http://example.com/file18.pdf', 18),
('file19.pdf', 2.1, 21, 'http://example.com/file19.pdf', 19),
('file20.pdf', 2.7, 27, 'http://example.com/file20.pdf', 20),
('file21.pdf', 1.9, 19, 'http://example.com/file21.pdf', 21),
('file22.pdf', 2.3, 23, 'http://example.com/file22.pdf', 22),
('file23.pdf', 3.0, 29, 'http://example.com/file23.pdf', 23),
('file24.pdf', 1.2, 13, 'http://example.com/file24.pdf', 24),
('file25.pdf', 1.8, 17, 'http://example.com/file25.pdf', 25),
('file26.pdf', 2.4, 22, 'http://example.com/file26.pdf', 26),
('file27.pdf', 1.5, 16, 'http://example.com/file27.pdf', 27),
('file28.pdf', 2.9, 24, 'http://example.com/file28.pdf', 28),
('file29.pdf', 3.3, 28, 'http://example.com/file29.pdf', 29),
('file30.pdf', 1.4, 14, 'http://example.com/file30.pdf', 30);

INSERT INTO printingLog (orderID, logNumber, startTime, endTime, fileID) VALUES
(1, 1, '2024-01-10 09:00:00', '2024-01-10 09:30:00', 1),
(2, 1, '2024-01-15 11:00:00', '2024-01-15 11:30:00', 2),
(3, 1, '2024-02-10 13:00:00', '2024-02-10 13:30:00', 3),
(4, 1, '2024-03-05 14:00:00', '2024-03-05 14:30:00', 4),
(5, 1, '2024-04-01 16:00:00', '2024-04-01 16:30:00', 5),
(6, 1, '2024-04-20 18:00:00', '2024-04-20 18:30:00', 6),
(7, 1, '2024-05-10 09:00:00', '2024-05-10 09:30:00', 7),
(8, 1, '2024-06-15 11:00:00', '2024-06-15 11:30:00', 8),
(9, 1, '2024-07-12 13:00:00', '2024-07-12 13:30:00', 9),
(10, 1, '2024-08-20 14:00:00', '2024-08-20 14:30:00', 10),
(11, 1, '2024-09-11 16:00:00', '2024-09-11 16:30:00', 11),
(12, 1, '2024-10-13 18:00:00', '2024-10-13 18:30:00', 12),
(13, 1, '2024-11-15 09:00:00', '2024-11-15 09:30:00', 13),
(14, 1, '2024-12-10 11:00:00', '2024-12-10 11:30:00', 14),
(15, 1, '2024-12-11 13:00:00', '2024-12-11 13:30:00', 15),
(16, 1, '2024-12-12 14:00:00', '2024-12-12 14:30:00', 16),
(17, 1, '2024-12-13 16:00:00', '2024-12-13 16:30:00', 17),
(18, 1, '2024-12-14 18:00:00', '2024-12-14 18:30:00', 18),
(19, 1, '2024-12-15 09:00:00', '2024-12-15 09:30:00', 19),
(20, 1, '2024-12-16 11:00:00', '2024-12-16 11:30:00', 20),
(21, 1, '2024-12-17 13:00:00', '2024-12-17 13:30:00', 21),
(22, 1, '2024-12-18 14:00:00', '2024-12-18 14:30:00', 22),
(23, 1, '2024-12-19 16:00:00', '2024-12-19 16:30:00', 23),
(24, 1, '2024-12-20 18:00:00', '2024-12-20 18:30:00', 24),
(25, 1, '2024-12-21 09:00:00', '2024-12-21 09:30:00', 25),
(26, 1, '2024-12-22 11:00:00', '2024-12-22 11:30:00', 26),
(27, 1, '2024-12-23 13:00:00', '2024-12-23 13:30:00', 27),
(28, 1, '2024-12-24 14:00:00', '2024-12-24 14:30:00', 28),
(29, 1, '2024-12-25 16:00:00', '2024-12-25 16:30:00', 29),
(30, 1, '2024-12-26 18:00:00', '2024-12-26 18:30:00', 30);

INSERT INTO combo (id, price, numCoins) VALUES
('CB0001', 10000, 100),
('CB0002', 20000, 200),
('CB0003', 30000, 300),
('CB0004', 40000, 400),
('CB0005', 50000, 500),
('CB0006', 60000, 600);

INSERT INTO paymentLog (paymentTime, money) VALUES
('2024-01-03 07:00:00', 10000),
('2024-01-10 09:00:00', 100),
('2024-01-15 11:00:00', 150),
('2024-02-10 13:00:00', 200),
('2024-03-05 14:00:00', 250),
('2024-04-01 16:00:00', 300),
('2024-04-20 18:00:00', 350),
('2024-04-22 15:00:00', 50000),
('2024-05-10 09:00:00', 400),
('2024-06-15 11:00:00', 450),
('2024-07-12 13:00:00', 500),
('2024-07-12 14:00:00', 30000),
('2024-08-10 15:00:00', 30000),
('2024-08-20 14:00:00', 550),
('2024-09-11 16:00:00', 600),
('2024-10-13 18:00:00', 650),
('2024-11-15 09:00:00', 700),
('2024-12-10 11:00:00', 750),
('2024-12-11 13:00:00', 800),
('2024-12-12 14:00:00', 850),
('2024-12-13 16:00:00', 900),
('2024-12-14 18:00:00', 950),
('2024-12-15 09:00:00', 1000),
('2024-12-16 11:00:00', 1050),
('2024-12-17 13:00:00', 1100),
('2024-12-18 14:00:00', 1150),
('2024-12-19 16:00:00', 1200),
('2024-12-20 18:00:00', 1250),
('2024-12-21 09:00:00', 1300),
('2024-12-22 11:00:00', 1350),
('2024-12-23 13:00:00', 1400),
('2024-12-24 14:00:00', 1450),
('2024-12-25 16:00:00', 1500),
('2024-12-26 18:00:00', 1550),
('2024-12-27 09:00:00', 1600),
('2024-12-28 11:00:00', 1650),
('2024-12-29 13:00:00', 1700),
('2024-12-30 14:00:00', 1750),
('2024-12-31 16:00:00', 1800),
('2025-01-01 18:00:00', 1850),
('2025-01-02 09:00:00', 1900),
('2025-01-03 11:00:00', 1950),
('2025-01-04 13:00:00', 2000),
('2025-01-05 14:00:00', 2050),
('2025-01-06 16:00:00', 2100),
('2025-01-07 18:00:00', 2150),
('2025-01-08 09:00:00', 2200),
('2025-01-09 11:00:00', 2250),
('2025-01-10 13:00:00', 2300),
('2025-01-11 14:00:00', 2350),
('2025-01-12 16:00:00', 2400);

INSERT INTO depositLog (id, method, note, customerID) VALUES
(1, 'Credit Card', 'Initial deposit', 1),
(8, 'Bank Transfer', 'Additional deposit', 4),
(12, 'Credit Card', 'Initial deposit', 6),
(13, 'PayPal', 'Additional deposit', 8),
(14, 'Credit Card', 'Monthly deposit', 1),
(15, 'Bank Transfer', 'Quarterly deposit', 4),
(16, 'Credit Card', 'Annual deposit', 6),
(17, 'PayPal', 'Special deposit', 8),
(18, 'Credit Card', 'Monthly deposit', 1),
(19, 'Bank Transfer', 'Quarterly deposit', 4),
(20, 'Credit Card', 'Annual deposit', 6),
(21, 'PayPal', 'Special deposit', 8);

INSERT INTO depositCombo (logID, comboID, quantity) VALUES
(1, 'CB0001', 2),
(8, 'CB0002', 3),
(12, 'CB0003', 1),
(13, 'CB0004', 4),
(14, 'CB0001', 2),
(15, 'CB0002', 3),
(16, 'CB0003', 1),
(17, 'CB0004', 4),
(18, 'CB0001', 2),
(19, 'CB0002', 3),
(20, 'CB0003', 1),
(21, 'CB0004', 4);

INSERT INTO returnLog (id) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20);

INSERT INTO withdrawLog (id) VALUES
(5),
(6),
(7),
(8),
(13),
(14),
(15),
(16),
(17),
(18),
(19),
(20);

INSERT INTO makeOrders (customerID, orderID, logID, note) VALUES
(1, 1, 5, 'Order for printing documents'),
(4, 2, 6, 'Order for printing photos'),
(6, 3, 7, 'Order for printing flyers'),
(8, 4, 8, 'Order for printing posters'),
(1, 13, 13, 'Order for printing brochures'),
(4, 14, 14, 'Order for printing business cards'),
(6, 15, 15, 'Order for printing posters'),
(8, 16, 16, 'Order for printing banners'),
(1, 17, 17, 'Order for printing flyers'),
(4, 18, 18, 'Order for printing leaflets'),
(6, 19, 19, 'Order for printing catalogs'),
(8, 20, 20, 'Order for printing magazines');

INSERT INTO cancelOrders (customerID, orderID, logID, note) VALUES
(1, 5, 1, 'Order cancelled by customer'),
(4, 6, 2, 'Order cancelled by customer'),
(6, 7, 3, 'Order cancelled by customer'),
(8, 8, 4, 'Order cancelled by customer'),
(1, 21, 5, 'Order cancelled by customer'),
(4, 22, 6, 'Order cancelled by customer'),
(6, 23, 7, 'Order cancelled by customer'),
(8, 24, 8, 'Order cancelled by customer'),
(1, 25, 9, 'Order cancelled by customer'),
(4, 26, 10, 'Order cancelled by customer'),
(6, 27, 11, 'Order cancelled by customer'),
(8, 28, 12, 'Order cancelled by customer');

INSERT INTO declineOrders (staffID, orderID, logID, note) VALUES
(1, 9, 5, 'Order declined due to printer issue'),
(3, 10, 6, 'Order declined due to insufficient funds'),
(9, 11, 7, 'Order declined due to incorrect file format'),
(10, 12, 8, 'Order declined due to high volume'),
(1, 29, 13, 'Order declined due to printer issue'),
(3, 30, 14, 'Order declined due to insufficient funds'),
(9, 31, 15, 'Order declined due to incorrect file format'),
(10, 32, 16, 'Order declined due to high volume'),
(1, 33, 17, 'Order declined due to printer issue'),
(3, 34, 18, 'Order declined due to insufficient funds'),
(9, 35, 19, 'Order declined due to incorrect file format'),
(10, 36, 20, 'Order declined due to high volume');

DELIMITER $$
CREATE TRIGGER increase_pk_combo
BEFORE INSERT ON combo
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(255);
    SET new_id = CONCAT('CB', LPAD(IFNULL((SELECT MAX(CAST(SUBSTRING(id, 3) AS UNSIGNED)) FROM combo), 0) + 1, 4, '0'));
    SET NEW.id = new_id;
END $$

DELIMITER ;

ALTER TABLE printer
ADD CONSTRAINT printer_ibfk_1 FOREIGN KEY (locationID) REFERENCES location (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT chk_status CHECK ((printerStatus in ('Available','Unavailabl')));

ALTER TABLE account
ADD CONSTRAINT chk_fullName CHECK (regexp_like(fullName,'^[A-Za-zÀ-ỹ\\s]{2,}$')),
ADD CONSTRAINT chk_roles CHECK ((roles in ('User','SPSO','Printing Staff'))),
ADD CONSTRAINT chk_username CHECK ((char_length(username) between 8 and 20));

ALTER TABLE spso
ADD CONSTRAINT spso_ibfk_1 FOREIGN KEY (id) REFERENCES account (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE spsoPhoneNumbers
ADD CONSTRAINT spsoPhoneNumbers_ibfk_1 FOREIGN KEY (id) REFERENCES spso (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT chk_phone_spso CHECK (regexp_like(phoneNumber,'^[0-9]{10,11}$'));

ALTER TABLE manage
ADD CONSTRAINT manage_ibfk_1 FOREIGN KEY (spsoID) REFERENCES spso (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT manage_ibfk_2 FOREIGN KEY (printerID) REFERENCES printer (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE manipulation
ADD CONSTRAINT manipulation_ibfk_1 FOREIGN KEY (spsoID, printerID) REFERENCES manage (spsoID, printerID) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE customer
ADD CONSTRAINT customer_ibfk_1 FOREIGN KEY (id) REFERENCES account (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE staff
ADD CONSTRAINT staff_ibfk_1 FOREIGN KEY (id) REFERENCES account (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT staff_ibfk_2 FOREIGN KEY (locationID) REFERENCES location (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT staff_ibfk_3 FOREIGN KEY (spsoID) REFERENCES spso (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT staff_ibfk_4 FOREIGN KEY (mentorID) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE staffPhoneNumbers
ADD CONSTRAINT staffPhoneNumbers_ibfk_1 FOREIGN KEY (id) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT chk_phone_staff CHECK (regexp_like(phoneNumber,'^[0-9]{10,11}$'));

ALTER TABLE operatedBy
ADD CONSTRAINT operatedBy_ibfk_1 FOREIGN KEY (printerID) REFERENCES printer (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT operatedBy_ibfk_2 FOREIGN KEY (staffID) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE repairedBy
ADD CONSTRAINT repairedBy_ibfk_1 FOREIGN KEY (printerID) REFERENCES printer (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT repairedBy_ibfk_2 FOREIGN KEY (staffID) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE userOrders
ADD CONSTRAINT userOrders_ibfk_1 FOREIGN KEY (printerID) REFERENCES printer (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT userOrders_ibfk_2 FOREIGN KEY (staffID) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE package
ADD CONSTRAINT package_ibfk_1 FOREIGN KEY (orderID) REFERENCES userOrders (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE packagePrintingPages
ADD CONSTRAINT packagePrintingPages_ibfk_1 FOREIGN KEY (packageID) REFERENCES package (id) ON DELETE CASCADE;

ALTER TABLE fileMetadata
ADD CONSTRAINT fileMetadata_ibfk_1 FOREIGN KEY (packageID) REFERENCES package (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE printingLog
ADD CONSTRAINT printingLog_ibfk_1 FOREIGN KEY (orderID) REFERENCES userOrders (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT printingLog_ibfk_2 FOREIGN KEY (fileID) REFERENCES fileMetadata (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE combo
ADD CONSTRAINT chk_coin CHECK ((numCoins > 0)),
ADD CONSTRAINT chk_price CHECK ((price > 0));

ALTER TABLE paymentLog
ADD CONSTRAINT check_money CHECK ((money > 0));

ALTER TABLE depositLog
ADD  CONSTRAINT depositLog_ibfk_1 FOREIGN KEY (id) REFERENCES paymentLog (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD  CONSTRAINT depositLog_ibfk_2 FOREIGN KEY (customerID) REFERENCES customer (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE depositCombo
ADD  CONSTRAINT depositCombo_ibfk_2 FOREIGN KEY (comboID) REFERENCES combo (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD  CONSTRAINT depositCombo_ibfk_1 FOREIGN KEY (logID) REFERENCES depositLog (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD  CONSTRAINT chk_quantity CHECK ((quantity > 0));

ALTER TABLE returnLog
ADD CONSTRAINT returnLog_ibfk_1 FOREIGN KEY (id) REFERENCES paymentLog (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE withdrawLog
ADD  CONSTRAINT withdrawLog_ibfk_1 FOREIGN KEY (id) REFERENCES paymentLog (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE makeOrders
ADD  CONSTRAINT makeOrders_ibfk_1 FOREIGN KEY (customerID) REFERENCES customer (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD  CONSTRAINT makeOrders_ibfk_2 FOREIGN KEY (orderID) REFERENCES userOrders (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD  CONSTRAINT makeOrders_ibfk_3 FOREIGN KEY (logID) REFERENCES withdrawLog (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE cancelOrders
ADD  CONSTRAINT cancelOrders_ibfk_1 FOREIGN KEY (customerID) REFERENCES customer (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD  CONSTRAINT cancelOrders_ibfk_2 FOREIGN KEY (orderID) REFERENCES userOrders (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD  CONSTRAINT cancelOrders_ibfk_3 FOREIGN KEY (logID) REFERENCES returnLog (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE declineOrders
ADD  CONSTRAINT declineOrders_ibfk_1 FOREIGN KEY (staffID) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD  CONSTRAINT declineOrders_ibfk_2 FOREIGN KEY (orderID) REFERENCES userOrders (id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD  CONSTRAINT declineOrders_ibfk_3 FOREIGN KEY (logID) REFERENCES returnLog (id) ON DELETE CASCADE ON UPDATE CASCADE;