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
  KEY locationID (locationID),
  CONSTRAINT printer_ibfk_1 FOREIGN KEY (locationID) REFERENCES location (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_status CHECK ((printerStatus in ('Available','Unavailabl')))
);

CREATE TABLE account (
  id INT NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL,
  accountPassword varchar(100) NOT NULL,
  fullName varchar(100) DEFAULT NULL,
  roles varchar(20) NOT NULL DEFAULT 'user',
  PRIMARY KEY (id),
  UNIQUE KEY username (username),
  CONSTRAINT chk_fullName CHECK (regexp_like(fullName,'^[A-Za-zÀ-ỹ\\s]{2,}$')),
  CONSTRAINT chk_password CHECK (regexp_like(accountPassword,'^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).{8,60}$')),
  CONSTRAINT chk_roles CHECK ((roles in ('User','SPSO','Printing Staff'))),
  CONSTRAINT chk_username CHECK ((char_length(username) between 8 and 20))
);

CREATE TABLE spso (
  id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT spso_ibfk_1 FOREIGN KEY (id) REFERENCES account (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE spsoPhoneNumbers (
  id INT NOT NULL,
  phoneNumber varchar(20) NOT NULL,
  PRIMARY KEY (id,phoneNumber),
  CONSTRAINT spsoPhoneNumbers_ibfk_1 FOREIGN KEY (id) REFERENCES spso (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_phone_spso CHECK (regexp_like(phoneNumber,'^[0-9]{10,11}$'))
);

CREATE TABLE manage (
  spsoID INT NOT NULL,
  printerID INT NOT NULL,
  PRIMARY KEY (spsoID,printerID),
  KEY printerID (printerID),
  CONSTRAINT manage_ibfk_1 FOREIGN KEY (spsoID) REFERENCES spso (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT manage_ibfk_2 FOREIGN KEY (printerID) REFERENCES printer (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE manipulation (
  spsoID INT NOT NULL,
  printerID INT NOT NULL,
  spsoAction varchar(20) NOT NULL,
  actionTime timestamp NOT NULL,
  PRIMARY KEY (spsoID,printerID,spsoAction,actionTime),
  CONSTRAINT manipulation_ibfk_1 FOREIGN KEY (spsoID, printerID) REFERENCES manage (spsoID, printerID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE customer (
  id INT NOT NULL,
  balance INT DEFAULT '0',
  PRIMARY KEY (id),
  CONSTRAINT customer_ibfk_1 FOREIGN KEY (id) REFERENCES account (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE staff (
  id INT NOT NULL,
  locationID INT NOT NULL,
  spsoID INT NOT NULL,
  mentorID INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY locationID (locationID),
  KEY spsoID (spsoID),
  KEY mentorID (mentorID),
  CONSTRAINT staff_ibfk_1 FOREIGN KEY (id) REFERENCES account (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT staff_ibfk_2 FOREIGN KEY (locationID) REFERENCES location (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT staff_ibfk_3 FOREIGN KEY (spsoID) REFERENCES spso (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT staff_ibfk_4 FOREIGN KEY (mentorID) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE staffPhoneNumbers (
  id INT NOT NULL,
  phoneNumber varchar(20) NOT NULL,
  PRIMARY KEY (id,phoneNumber),
  CONSTRAINT staffPhoneNumbers_ibfk_1 FOREIGN KEY (id) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_phone_staff CHECK (regexp_like(phoneNumber,'^[0-9]{10,11}$'))
);

CREATE TABLE operatedBy (
  printerID INT NOT NULL,
  staffID INT NOT NULL,
  PRIMARY KEY (printerID,staffID),
  KEY staffID (staffID),
  CONSTRAINT operatedBy_ibfk_1 FOREIGN KEY (printerID) REFERENCES printer (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT operatedBy_ibfk_2 FOREIGN KEY (staffID) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE repairedBy (
  printerID INT NOT NULL,
  staffID INT NOT NULL,
  repairDate timestamp NULL DEFAULT NULL,
  cost INT DEFAULT NULL,
  errorInfo varchar(255) DEFAULT NULL,
  PRIMARY KEY (printerID,staffID),
  KEY staffID (staffID),
  CONSTRAINT repairedBy_ibfk_1 FOREIGN KEY (printerID) REFERENCES printer (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT repairedBy_ibfk_2 FOREIGN KEY (staffID) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE
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
  KEY staffID (staffID),
  CONSTRAINT userOrders_ibfk_1 FOREIGN KEY (printerID) REFERENCES printer (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT userOrders_ibfk_2 FOREIGN KEY (staffID) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE
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
  KEY orderID (orderID),
  CONSTRAINT package_ibfk_1 FOREIGN KEY (orderID) REFERENCES userOrders (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE packagePrintingPages (
  packageID INT NOT NULL,
  color TINYINT(1) NOT NULL,
  fromPage INT NOT NULL,
  toPage INT NOT NULL,
  orientation varchar(20) NOT NULL,
  PRIMARY KEY (packageID,color,fromPage,toPage,orientation),
  CONSTRAINT packagePrintingPages_ibfk_1 FOREIGN KEY (packageID) REFERENCES package (id) ON DELETE CASCADE
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
  KEY packageID (packageID),
  CONSTRAINT fileMetadata_ibfk_1 FOREIGN KEY (packageID) REFERENCES package (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE printingLog (
  orderID INT NOT NULL,
  logNumber INT NOT NULL,
  startTime timestamp NULL DEFAULT NULL,
  endTime timestamp NULL DEFAULT NULL,
  fileID INT DEFAULT NULL,
  PRIMARY KEY (orderID,logNumber),
  KEY fileID (fileID),
  CONSTRAINT printingLog_ibfk_1 FOREIGN KEY (orderID) REFERENCES userOrders (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT printingLog_ibfk_2 FOREIGN KEY (fileID) REFERENCES fileMetadata (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE combo (
  id varchar(255) NOT NULL,
  price INT DEFAULT NULL,
  numCoins INT DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT chk_coin CHECK ((numCoins > 0)),
  CONSTRAINT chk_price CHECK ((price > 0))
);

CREATE TABLE paymentLog (
  id INT NOT NULL AUTO_INCREMENT,
  paymentTime timestamp NOT NULL,
  money INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT check_money CHECK ((money > 0))
);

CREATE TABLE depositLog (
  id INT NOT NULL,
  method varchar(50) DEFAULT NULL,
  note varchar(255) DEFAULT NULL,
  customerID INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY customerID (customerID),
  CONSTRAINT depositLog_ibfk_1 FOREIGN KEY (id) REFERENCES paymentLog (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT depositLog_ibfk_2 FOREIGN KEY (customerID) REFERENCES customer (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE depositCombo (
  logID INT NOT NULL,
  comboID varchar(255) NOT NULL,
  quantity INT DEFAULT NULL,
  PRIMARY KEY (logID,comboID),
  CONSTRAINT depositCombo_ibfk_2 FOREIGN KEY (comboID) REFERENCES combo (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT depositCombo_ibfk_1 FOREIGN KEY (logID) REFERENCES depositLog (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_quantity CHECK ((quantity > 0))
);

CREATE TABLE returnLog (
  id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT returnLog_ibfk_1 FOREIGN KEY (id) REFERENCES paymentLog (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE withdrawLog (
  id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT withdrawLog_ibfk_1 FOREIGN KEY (id) REFERENCES paymentLog (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE makeOrders (
  customerID INT NOT NULL,
  orderID INT NOT NULL,
  logID INT NOT NULL,
  note varchar(255) DEFAULT NULL,
  PRIMARY KEY (customerID,orderID),
  KEY orderID (orderID),
  KEY logID (logID),
  CONSTRAINT makeOrders_ibfk_1 FOREIGN KEY (customerID) REFERENCES customer (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT makeOrders_ibfk_2 FOREIGN KEY (orderID) REFERENCES userOrders (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT makeOrders_ibfk_3 FOREIGN KEY (logID) REFERENCES withdrawLog (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE cancelOrders (
  customerID INT NOT NULL,
  orderID INT NOT NULL,
  logID INT NOT NULL,
  note varchar(255) DEFAULT NULL,
  PRIMARY KEY (customerID,orderID),
  KEY orderID (orderID),
  KEY logID (logID),
  CONSTRAINT cancelOrders_ibfk_1 FOREIGN KEY (customerID) REFERENCES customer (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT cancelOrders_ibfk_2 FOREIGN KEY (orderID) REFERENCES userOrders (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT cancelOrders_ibfk_3 FOREIGN KEY (logID) REFERENCES returnLog (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE declineOrders (
  staffID INT NOT NULL,
  orderID INT NOT NULL,
  logID INT NOT NULL,
  note varchar(255) DEFAULT NULL,
  PRIMARY KEY (staffID,orderID),
  KEY orderID (orderID),
  KEY logID (logID),
  CONSTRAINT declineOrders_ibfk_1 FOREIGN KEY (staffID) REFERENCES staff (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT declineOrders_ibfk_2 FOREIGN KEY (orderID) REFERENCES userOrders (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT declineOrders_ibfk_3 FOREIGN KEY (logID) REFERENCES returnLog (id) ON DELETE CASCADE ON UPDATE CASCADE
);