use ssps;
DELIMITER $$
DROP PROCEDURE IF EXISTS GetPrintersBySPSO;
DROP PROCEDURE IF EXISTS AddManipulation;
DROP PROCEDURE IF EXISTS AddPrinter;
DROP PROCEDURE IF EXISTS AddManage;
DROP PROCEDURE IF EXISTS find_or_add_manage;
DROP PROCEDURE IF EXISTS UpdatePrinterStatus;
DROP PROCEDURE IF EXISTS UpdatePrinter;
DROP PROCEDURE IF EXISTS GetPrintersByIds;

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
    IN printerID INT,
)
BEGIN
    INSERT INTO manage (spsoID, printerID)
    VALUES (spsoID, printerID)
    SELECT LAST_INSERT_ID() AS manage_id;
END$$


CREATE PROCEDURE find_or_add_manage(
    IN p_spsoID INT,
    IN p_printerID INT, 
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

DELIMITER //

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
