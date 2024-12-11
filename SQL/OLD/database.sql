CREATE DATABASE ssps;
USE ssps;
-- LOCATION
CREATE TABLE location (
	id INT PRIMARY KEY AUTO_INCREMENT,
    campus VARCHAR(20) NOT NULL,
    building VARCHAR(20) NOT NULL,
    room VARCHAR(20) NOT NULL
);

-- Printer
CREATE TABLE printer (
	id INT PRIMARY KEY AUTO_INCREMENT,
    printerStatus VARCHAR(10), -- enum
    printerDescription VARCHAR(255),
    resolution VARCHAR(10),
    colorPrinting BOOL,
    side ENUM('1', '2'),
    price INT,
    model VARCHAR(50),
    speed INT,
    brand VARCHAR(50),
    wireless BOOL,
    printingMethod VARCHAR(20),
    locationID INT,
    FOREIGN KEY (locationID) REFERENCES location(id)
);
-- ACCOUNT
CREATE TABLE account (
	id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    accountPassword VARCHAR(100) NOT NULL,
    fullName VARCHAR(100)
);

-- SPSO
CREATE TABLE spso (
	id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES account(id)
);


-- SPSO Phone Number
CREATE TABLE spsoPhoneNumbers (
	id INT NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    PRIMARY KEY (id, phoneNumber),
    FOREIGN KEY (id) REFERENCES spso(id)
);


-- SPSO Manage Printer
CREATE TABLE manage (
	spsoID INT NOT NULL,
    printerID INT NOT NULL,
    PRIMARY KEY (spsoID, printerID),
    FOREIGN KEY (spsoID) REFERENCES spso(id),
    FOREIGN KEY (printerID) REFERENCES printer(id)
);

-- SPSO Manage Printer - Manipulation
CREATE TABLE manipulation (
	spsoID INT NOT NULL,
    printerID INT NOT NULL,
    spsoAction varchar(20) NOT NULL,
    actionTime TIMESTAMP NOT NULL,
    PRIMARY KEY (spsoID, printerID, spsoAction, actionTime),
    FOREIGN KEY (spsoID, printerID) REFERENCES manage(spsoID, printerID)
);

-- Student Lecturer
CREATE TABLE customer (
	id INT PRIMARY KEY,
    balance INT,
    FOREIGN KEY (id) REFERENCES account(id)
);
-- Printing Staff
CREATE TABLE staff (
	id INT PRIMARY KEY,
    locationID INT NOT NULL,
    spsoID INT NOT NULL,
    mentorID INT,
    FOREIGN KEY (id) REFERENCES account(id),
    FOREIGN KEY (locationID) REFERENCES location(id),
    FOREIGN KEY (spsoID) REFERENCES spso(id),
    FOREIGN KEY (mentorID) REFERENCES staff(id)
);
-- Staff Phone Number
CREATE TABLE staffPhoneNumbers (
	id INT NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    PRIMARY KEY (id, phoneNumber),
    FOREIGN KEY (id) REFERENCES staff(id)
);
-- Printer Operated by Staff
CREATE TABLE operatedBy (
	printerID INT NOT NULL,
    staffID INT NOT NULL,
    PRIMARY KEY (printerID, staffID),
    FOREIGN KEY (printerID) REFERENCES printer(id),
    FOREIGN KEY (staffID) REFERENCES staff(id)
);
-- Pritner Repaired by Staff
CREATE TABLE repairedBy (
	printerID INT NOT NULL,
    staffID INT NOT NULL,
    repairDate TIMESTAMP,
    cost INT,
    errorInfo VARCHAR(255),
    PRIMARY KEY (printerID, staffID),
    FOREIGN KEY (printerID) REFERENCES printer(id),
    FOREIGN KEY (staffID) REFERENCES staff(id)
);
-- Order
CREATE TABLE userOrders (
	id INT PRIMARY KEY AUTO_INCREMENT,
    orderStatus VARCHAR(50), -- enum
    orderDate TIMESTAMP,
    completeTime TIMESTAMP,
    printerID INT,
    staffID INT,
    FOREIGN KEY (printerID) REFERENCES printer(id),
    FOREIGN KEY (staffID) REFERENCES staff(id)
);
-- Package
CREATE TABLE package (
	id INT PRIMARY KEY AUTO_INCREMENT,
    numOfCopies INT,
    side ENUM('1', '2'),
    colorAllPages BOOL,
    pagePerSheet INT,
    paperSize VARCHAR(10),
    scale DOUBLE,
    cover BOOL,
    glass BOOL,
    binding BOOL,
    orderID INT,
    FOREIGN KEY (orderID) REFERENCES userOrders(id)
);
-- Package Printing Page
CREATE TABLE packagePrintingPages (
	packageID INT NOT NULL,
    color BOOL NOT NULL,
    fromPage INT NOT NULL,
    toPage INT NOT NULL,
    PRIMARY KEY (packageID, color, fromPage, toPage),
    FOREIGN KEY (packageID) REFERENCES package(id)
);
-- File
CREATE TABLE fileMetadata (
	id INT PRIMARY KEY AUTO_INCREMENT,
    fileName VARCHAR(255) NOT NULL,
    size DOUBLE,
    numPages INT,
    url VARCHAR(255) UNIQUE,
    packageID INT,
    FOREIGN KEY (packageID) REFERENCES package(id)
);
-- Printing Log
CREATE TABLE printingLog (
	orderID INT NOT NULL,
    logNumber INT NOT NULL,
    startTime TIMESTAMP,
    endTime TIMESTAMP,
    fileID INT,
    PRIMARY KEY (orderID, logNumber),
    FOREIGN KEY (orderID) REFERENCES userOrders(id),
    FOREIGN KEY (fileID) REFERENCES fileMetadata(id)
);
-- Combo
CREATE TABLE combo (
	id INT PRIMARY KEY AUTO_INCREMENT,
    price INT,
    numCoins INT
);
-- Payment Log
CREATE TABLE paymentLog (
	id INT PRIMARY KEY AUTO_INCREMENT,
    paymentTime TIMESTAMP,
    money INT
);
-- Deposit Log
CREATE TABLE depositLog (
	id INT PRIMARY KEY,
    method VARCHAR(50),
    note VARCHAR(255),
    customerID INT,
    FOREIGN KEY (id) REFERENCES paymentLog(id),
    FOREIGN KEY (customerID) REFERENCES customer(id)
);
-- Deposit Log Contain Combo
CREATE TABLE depositCombo (
	logID INT NOT NULL,
    comboID INT NOT NULL,
    quantity INT,
    PRIMARY KEY (logID, comboID),
    FOREIGN KEY (logID) REFERENCES depositLog(id),
    FOREIGN KEY (comboID) REFERENCES combo(id)
);
-- Return Log
CREATE TABLE returnLog (
	id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES paymentLog(id)
);
-- Withdraw Log
CREATE TABLE withdrawLog (
	id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES paymentLog(id)
);
-- Make Student_Lecturer Order Withdraw
CREATE TABLE makeOrders (
	customerID INT NOT NULL,
    orderID INT NOT NULL,
    logID INT NOT NULL,
    note VARCHAR(255),
    PRIMARY KEY (customerID, orderID),
    FOREIGN KEY (customerID) REFERENCES customer(id),
    FOREIGN KEY (orderID) REFERENCES userOrders(id),
    FOREIGN KEY (logID) REFERENCES withdrawLog(id)
);
-- Cancel Student_Lecturer Order Return
CREATE TABLE cancelOrders (
	customerID INT NOT NULL,
    orderID INT NOT NULL,
    logID INT NOT NULL,
    note VARCHAR(255),
    PRIMARY KEY (customerID, orderID),
    FOREIGN KEY (customerID) REFERENCES customer(id),
    FOREIGN KEY (orderID) REFERENCES userOrders(id),
    FOREIGN KEY (logID) REFERENCES returnLog(id)
);
-- Decline Student_Lecturer Order Return
CREATE TABLE declineOrders (
	staffID INT NOT NULL,
    orderID INT NOT NULL,
    logID INT NOT NULL,
    note VARCHAR(255),
    PRIMARY KEY (staffID, orderID),
    FOREIGN KEY (staffID) REFERENCES staff(id),
    FOREIGN KEY (orderID) REFERENCES userOrders(id),
    FOREIGN KEY (logID) REFERENCES returnLog(id)
);