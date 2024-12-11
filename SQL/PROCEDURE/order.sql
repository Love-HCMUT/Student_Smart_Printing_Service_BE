-- addOrder
DROP PROCEDURE IF EXISTS addOrder;
DELIMITER $$

CREATE PROCEDURE `addOrder`(
    p_orderStatus VARCHAR(50),
    p_orderData TIMESTAMP,
    p_printerID INT
)
BEGIN
    INSERT INTO userOrders (orderStatus, orderDate, printerID) VALUES (p_orderStatus, p_orderData, p_printerID);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$

DELIMITER ;

-- getOrderByPrinterID
DROP PROCEDURE IF EXISTS getOrderByPrinterID;
DELIMITER $$

CREATE PROCEDURE `getOrderByPrinterID`(
    p_printerID INT
)
BEGIN
    SELECT * FROM userOrders WHERE printerID = p_printerID AND lower(orderStatus) = 'pending';
END$$

DELIMITER ;

-- updateOrderStatus
DROP PROCEDURE IF EXISTS updateOrderStatus;
DELIMITER $$

CREATE PROCEDURE `updateOrderStatus`(
    p_id INT,
    p_orderStatus VARCHAR(50)
)
BEGIN
    UPDATE userOrders SET orderStatus = p_orderStatus WHERE id = p_id;
END$$

DELIMITER ;

-- updateOrderCompleteTime
DROP PROCEDURE IF EXISTS updateOrderCompleteTime;
DELIMITER $$

CREATE PROCEDURE `updateOrderCompleteTime`(
    p_id INT
)
BEGIN
    UPDATE userOrders SET orderStatus = 'Completed', completeTime = CURRENT_TIMESTAMP() WHERE id = p_id;
END$$

DELIMITER ;

-- updateOrderStaffID
DROP PROCEDURE IF EXISTS updateOrderStaffID;
DELIMITER $$

CREATE PROCEDURE `updateOrderStaffID`(
    p_id INT,
    p_staffID INT
)
BEGIN
    UPDATE userOrders SET staffID = p_staffID WHERE id = p_id;
END$$

DELIMITER ;

-- addPackage
DROP PROCEDURE IF EXISTS addPackage;
DELIMITER $$

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

DELIMITER ;

-- getPackageByOrderID
DROP PROCEDURE IF EXISTS getPackageByOrderID;
DELIMITER $$

CREATE PROCEDURE `getPackageByOrderID`(
    p_orderID INT
)
BEGIN
    SELECT * FROM package WHERE orderID = p_orderID;
END$$

DELIMITER ;

-- addPackagePrintingPages
DROP PROCEDURE IF EXISTS addPackagePrintingPages;
DELIMITER $$

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

DELIMITER ;

-- getPackagePrintingPagesByPackageID
DROP PROCEDURE IF EXISTS getPackagePrintingPagesByPackageID;
DELIMITER $$

CREATE PROCEDURE `getPackagePrintingPagesByPackageID`(
    p_packageID INT
)
BEGIN
    SELECT * FROM packagePrintingPages WHERE packageID = p_packageID;
END$$

DELIMITER ;

-- addFileMetadata
DROP PROCEDURE IF EXISTS addFileMetadata;
DELIMITER $$

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

DELIMITER ;

-- getFileMetadataByPackageID
DROP PROCEDURE IF EXISTS getFileMetadataByPackageID;
DELIMITER $$

CREATE PROCEDURE `getFileMetadataByPackageID`(
    p_packageID INT
)
BEGIN
    SELECT * FROM fileMetadata WHERE packageID = p_packageID;
END$$

DELIMITER ;

-- addPaymentLog
DROP PROCEDURE IF EXISTS addPaymentLog;
DELIMITER $$

CREATE PROCEDURE `addPaymentLog`(
    p_paymentTime TIMESTAMP,
    p_money INT
)
BEGIN
    INSERT INTO paymentLog (paymentTime, money) VALUES (p_paymentTime, p_money);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$

DELIMITER ;

-- addWithdrawLog
DROP PROCEDURE IF EXISTS addWithdrawLog;
DELIMITER $$

CREATE PROCEDURE `addWithdrawLog`(
    p_id INT
)
BEGIN
    INSERT INTO withdrawLog (id) VALUES (p_id);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$

DELIMITER ;

-- addReturnLog
DROP PROCEDURE IF EXISTS addReturnLog;
DELIMITER $$

CREATE PROCEDURE `addReturnLog`(
    p_id INT
)
BEGIN
    INSERT INTO returnLog (id) VALUES (p_id);
	SELECT LAST_INSERT_ID() AS insertedId;
END$$

DELIMITER ;

-- addMakeOrders
DROP PROCEDURE IF EXISTS addMakeOrders;
DELIMITER $$

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

DELIMITER ;

-- addCancelOrders
DROP PROCEDURE IF EXISTS addCancelOrders;
DELIMITER $$

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

DELIMITER ;

-- addDeclineOrders
DROP PROCEDURE IF EXISTS addDeclineOrders;
DELIMITER $$

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

DELIMITER ;

-- getAllActivePrinter
DROP PROCEDURE IF EXISTS getAllActivePrinter;
DELIMITER $$

CREATE PROCEDURE `getAllActivePrinter`(
    p_printerStatus VARCHAR(10),
    p_colorPrinting BOOL
)
BEGIN
    SELECT printer.id AS id, printingMethod, campus, building, room FROM printer JOIN location ON locationID = location.id WHERE lower(printerStatus) = p_printerStatus AND colorPrinting = p_colorPrinting;
END$$

DELIMITER ;

-- getCustomer
DROP PROCEDURE IF EXISTS getCustomer;
DELIMITER $$

CREATE PROCEDURE `getCustomer`(
    p_id INT
)
BEGIN
    SELECT * FROM customer WHERE id = p_id;
END$$

DELIMITER ;

-- getPrinterByStaffID
DROP PROCEDURE IF EXISTS getPrinterByStaffID;
DELIMITER $$

CREATE PROCEDURE `getPrinterByStaffID`(
    p_staffID INT
)
BEGIN
    SELECT * FROM operatedBy JOIN printer ON id = printerID WHERE staffID = p_staffID;
END$$

DELIMITER ;

-- decreaseCustomerBalance
DROP PROCEDURE IF EXISTS decreaseCustomerBalance;
DELIMITER $$

CREATE PROCEDURE `decreaseCustomerBalance`(
    p_id INT,
    p_amount DOUBLE
)
BEGIN
    UPDATE customer SET balance = balance - p_amount  WHERE id = p_id;
END$$

DELIMITER ;

-- increaseCustomerBalance
DROP PROCEDURE IF EXISTS increaseCustomerBalance;
DELIMITER $$

CREATE PROCEDURE `increaseCustomerBalance`(
    p_id INT,
    p_amount DOUBLE
)
BEGIN
    UPDATE customer SET balance = balance + p_amount  WHERE id = p_id;
END$$

DELIMITER ;

-- getOrderCost
DROP PROCEDURE IF EXISTS getOrderCost;
DELIMITER $$

CREATE PROCEDURE `getOrderCost`(
    p_orderID INT
)
BEGIN
    SELECT * FROM makeOrders JOIN paymentLog ON logID = id where orderID = p_orderID;
END$$

DELIMITER ;

-- addPrintingLog
DROP PROCEDURE IF EXISTS addPrintingLog;
DELIMITER $$

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

DELIMITER ;

-- updatePrintingLogEndTime
DROP PROCEDURE IF EXISTS updatePrintingLogEndTime;
DELIMITER $$

CREATE PROCEDURE `updatePrintingLogEndTime`(
    p_fileID INT,
    p_endTime TIMESTAMP
)
BEGIN
    UPDATE printingLog SET endTime = p_endTime WHERE fileID = p_fileID;
END$$

DELIMITER ;