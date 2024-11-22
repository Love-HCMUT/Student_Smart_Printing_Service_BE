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
    FOREIGN KEY (locationID) REFERENCES location(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ACCOUNT
CREATE TABLE account (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    accountPassword VARCHAR(50) NOT NULL,
    fullName VARCHAR(100),
    roles VARCHAR(20) NOT NULL DEFAULT 'user'
);

-- SPSO
CREATE TABLE spso (
	id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES account(id) 
    ON DELETE CASCADE ON UPDATE CASCADE
);


-- SPSO Phone Number
CREATE TABLE spsoPhoneNumbers (
	id INT NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    PRIMARY KEY (id, phoneNumber),
    FOREIGN KEY (id) REFERENCES spso(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- SPSO Manage Printer
CREATE TABLE manage (
	spsoID INT NOT NULL,
    printerID INT NOT NULL,
    PRIMARY KEY (spsoID, printerID),
    FOREIGN KEY (spsoID) REFERENCES spso(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (printerID) REFERENCES printer(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- SPSO Manage Printer - Manipulation
CREATE TABLE manipulation (
	spsoID INT NOT NULL,
    printerID INT NOT NULL,
    spsoAction varchar(20) NOT NULL,
    actionTime TIMESTAMP NOT NULL,
    PRIMARY KEY (spsoID, printerID, spsoAction, actionTime),
    FOREIGN KEY (spsoID, printerID) REFERENCES manage(spsoID, printerID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Student Lecturer
CREATE TABLE customer (
	id INT PRIMARY KEY,
    balance INT,
    FOREIGN KEY (id) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Printing Staff
CREATE TABLE staff (
	id INT PRIMARY KEY,
    locationID INT NOT NULL,
    spsoID INT NOT NULL,
    mentorID INT,
    FOREIGN KEY (id) REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (locationID) REFERENCES location(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (spsoID) REFERENCES spso(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (mentorID) REFERENCES staff(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Staff Phone Number
CREATE TABLE staffPhoneNumbers (
	id INT NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    PRIMARY KEY (id, phoneNumber),
    FOREIGN KEY (id) REFERENCES staff(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Printer Operated by Staff
CREATE TABLE operatedBy (
	printerID INT NOT NULL,
    staffID INT NOT NULL,
    PRIMARY KEY (printerID, staffID),
    FOREIGN KEY (printerID) REFERENCES printer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (staffID) REFERENCES staff(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Pritner Repaired by Staff
CREATE TABLE repairedBy (
	printerID INT NOT NULL,
    staffID INT NOT NULL,
    repairDate TIMESTAMP,
    cost INT,
    errorInfo VARCHAR(255),
    PRIMARY KEY (printerID, staffID),
    FOREIGN KEY (printerID) REFERENCES printer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (staffID) REFERENCES staff(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Order
CREATE TABLE userOrders (
	id INT PRIMARY KEY AUTO_INCREMENT,
    orderStatus VARCHAR(50), -- enum
    orderDate TIMESTAMP,
    completeTime TIMESTAMP,
    printerID INT,
    staffID INT,
    FOREIGN KEY (printerID) REFERENCES printer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (staffID) REFERENCES staff(id) ON DELETE CASCADE ON UPDATE CASCADE
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
    FOREIGN KEY (orderID) REFERENCES userOrders(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Package Printing Page
CREATE TABLE packagePrintingPages (
	packageID INT NOT NULL,
    color BOOL NOT NULL,
    fromPage INT NOT NULL,
    toPage INT NOT NULL,
    PRIMARY KEY (packageID, color, fromPage, toPage),
    FOREIGN KEY (packageID) REFERENCES package(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- File
CREATE TABLE fileMetadata (
	id INT PRIMARY KEY AUTO_INCREMENT,
    fileName VARCHAR(255) NOT NULL,
    size DOUBLE,
    numPages INT,
    url VARCHAR(255) UNIQUE,
    packageID INT,
    FOREIGN KEY (packageID) REFERENCES package(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Printing Log
CREATE TABLE printingLog (
	orderID INT NOT NULL,
    logNumber INT NOT NULL,
    startTime TIMESTAMP,
    endTime TIMESTAMP,
    fileID INT,
    PRIMARY KEY (orderID, logNumber),
    FOREIGN KEY (orderID) REFERENCES userOrders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (fileID) REFERENCES fileMetadata(id) ON DELETE CASCADE ON UPDATE CASCADE
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
    FOREIGN KEY (id) REFERENCES paymentLog(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (customerID) REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Deposit Log Contain Combo
CREATE TABLE depositCombo (
	logID INT NOT NULL,
    comboID INT NOT NULL,
    quantity INT,
    PRIMARY KEY (logID, comboID),
    FOREIGN KEY (logID) REFERENCES depositLog(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (comboID) REFERENCES combo(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Return Log
CREATE TABLE returnLog (
	id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES paymentLog(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Withdraw Log
CREATE TABLE withdrawLog (
	id INT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES paymentLog(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Make Student_Lecturer Order Withdraw
CREATE TABLE makeOrders (
	customerID INT NOT NULL,
    orderID INT NOT NULL,
    logID INT NOT NULL,
    note VARCHAR(255),
    PRIMARY KEY (customerID, orderID),
    FOREIGN KEY (customerID) REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (orderID) REFERENCES userOrders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (logID) REFERENCES withdrawLog(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Cancel Student_Lecturer Order Return
CREATE TABLE cancelOrders (
	customerID INT NOT NULL,
    orderID INT NOT NULL,
    logID INT NOT NULL,
    note VARCHAR(255),
    PRIMARY KEY (customerID, orderID),
    FOREIGN KEY (customerID) REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (orderID) REFERENCES userOrders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (logID) REFERENCES returnLog(id) ON DELETE CASCADE ON UPDATE CASCADE
);
-- Decline Student_Lecturer Order Return
CREATE TABLE declineOrders (
	staffID INT NOT NULL,
    orderID INT NOT NULL,
    logID INT NOT NULL,
    note VARCHAR(255),
    PRIMARY KEY (staffID, orderID),
    FOREIGN KEY (staffID) REFERENCES staff(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (orderID) REFERENCES userOrders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (logID) REFERENCES returnLog(id) ON DELETE CASCADE ON UPDATE CASCADE
);