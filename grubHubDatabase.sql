create database grubHub;
use grubHub;
show tables;

CREATE TABLE restaurantSectionTable(
    sectionItemId INT NOT NULL AUTO_INCREMENT,
    restaurantId INT NOT NULL,
    sectionName VARCHAR(100) NOT NULL,
    PRIMARY KEY (sectionItemId)
);

CREATE TABLE restaurantMenuTable(
    menuItemId INT NOT NULL AUTO_INCREMENT,
    menuItemName VARCHAR(100) NOT NULL,
    menuItemDesc VARCHAR(100) NOT NULL,
    menuItemImage VARCHAR(100),
    menuItemPrice float(5) NOT NULL,
    menuItemSection VARCHAR(100) NOT NULL, 
    restaurantId INT NOT NULL, /* This points to which restaurant i.e., Restaurant this menu Item belongs to */
    PRIMARY KEY(menuItemId)
);

CREATE TABLE restaurantTable(
	restaurantId INT NOT NULL AUTO_INCREMENT,
	restaurantName VARCHAR(100),
	restaurantEmailId VARCHAR(40),
	restaurantPassword VARCHAR(100),
    restaurantAddress VARCHAR(100),
	restaurantCuisine VARCHAR(40),
    restaurantPhone VARCHAR(15),
	restaurantImage VARCHAR(50),
	PRIMARY KEY (restaurantId)
); 
    
CREATE TABLE buyerTable(
	buyerId INT NOT NULL AUTO_INCREMENT,
	buyerName VARCHAR(100),
	buyerEmailId VARCHAR(40),
	buyerPassword VARCHAR(100),
    buyerAddress VARCHAR(200),
    buyerPhone VARCHAR(15),
	buyerImage VARCHAR(50),
	PRIMARY KEY (buyerId)
);

CREATE TABLE restaurantOrderTable(
    restaurantEmailId VARCHAR(40) NOT NULL,
	restaurantId VARCHAR(40) NOT NULL,
    buyerEmailId VARCHAR(40) NOT NULL,
    buyerName VARCHAR(40) NOT NULL,
    buyerAddress VARCHAR(100) NOT NULL,
    uniqueOrderId INT NOT NULL AUTO_INCREMENT,
    restaurantOrderStatus ENUM('New', 'Preparing', 'Ready', 'Delivered', 'Rejected'),
    PRIMARY KEY(uniqueOrderId)
);


CREATE TABLE buyerOrderTable(
    uniqueOrderId INT NOT NULL,
    buyerEmailId VARCHAR(100) NOT NULL,
    buyerOrderStatus ENUM('Past', 'Upcoming', 'Rejected'),
    PRIMARY KEY(uniqueOrderId) /* This key points to exact same order in restaurant's order table */
);


CREATE TABLE orderItemInfoTable(
    orderItemId INT NOT NULL AUTO_INCREMENT,
    uniqueOrderId INT NOT NULL,
    itemId INT NOT NULL,
    itemName VARCHAR(100) NOT NULL,
    itemQuantity int(5) NOT NULL,
    itemTotalPrice float(5) NOT NULL,
    PRIMARY KEY(orderItemId)
);