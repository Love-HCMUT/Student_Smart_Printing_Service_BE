use ssps;
DELIMITER $$
DROP PROCEDURE IF EXISTS add_account;
DROP PROCEDURE IF EXISTS find_or_add_location;
DROP PROCEDURE IF EXISTS add_customer;
DROP PROCEDURE IF EXISTS add_spso;
DROP PROCEDURE IF EXISTS add_spso_phone_number;
DROP PROCEDURE IF EXISTS add_staff_phone_number;
DROP PROCEDURE IF EXISTS add_staff;
DROP PROCEDURE IF EXISTS addLocation;
DROP PROCEDURE IF EXISTS find_account_by_username;

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

DELIMITER ;


