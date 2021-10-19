CREATE DATABASE IF NOT EXISTS uber_eats_db;
USE uber_eats_db;

CREATE TABLE customers (
	customer_ID INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    middle_name VARCHAR(30) DEFAULT "",
    last_name VARCHAR(30),
    email_id VARCHAR(50),
    pass VARCHAR(50),
    country VARCHAR(50),
    phone_number VARCHAR(20),
    about VARCHAR(200) DEFAULT "",
    profile_picture VARCHAR(100) DEFAULT "",
    favourites VARCHAR(100) DEFAULT "",
    dob VARCHAR(100),
    city VARCHAR(100),
    nickname VARCHAR(20) DEFAULT ""
);

CREATE TABLE restaurants (
    restaurant_ID INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_name VARCHAR(50),
    owner_name VARCHAR(50),
    email_id VARCHAR(50),
    pass VARCHAR(50),
    country VARCHAR(50),
    phone_number VARCHAR(20),
    vegetarian BOOLEAN,
    non_vegetarian BOOLEAN,
    vegan BOOLEAN,
    delivery BOOLEAN,
    pickup BOOLEAN,
    cover_image VARCHAR(500),
    about VARCHAR(1000),
    opening_time VARCHAR(20),
    closing_time VARCHAR(20)
);

-- CREATE TABLE locations (
--     location_ID INT PRIMARY KEY AUTO_INCREMENT,
--     location_name VARCHAR(50),
--     state_name VARCHAR(50)
-- );

CREATE TABLE customer_addresses (
    address_ID INT PRIMARY KEY AUTO_INCREMENT,
    customer_ID INT,
    line1 VARCHAR(100),
    line2 VARCHAR (100) DEFAULT "",
    city VARCHAR(50),
    state_name VARCHAR(50),
    zipcode INT,
    address_type VARCHAR(100)
);

CREATE TABLE restaurant_addresses (
    address_ID INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_ID INT,
    line1 VARCHAR(100),
    line2 VARCHAR (100) DEFAULT "",
    city VARCHAR(50),
    state_name VARCHAR(50),
    zipcode INT
);

CREATE TABLE orders (
    order_ID INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_ID INT,
    customer_ID INT,
    address_ID INT,
    order_status VARCHAR(50),
    total_amount VARCHAR(10)
);

CREATE TABLE order_details (
    order_item_ID INT PRIMARY KEY AUTO_INCREMENT,
    dish_ID INT,
    quantity INT,
    order_ID INT
);

CREATE TABLE dishes (
    dish_ID INT PRIMARY KEY AUTO_INCREMENT,
    dish_name VARCHAR(50),
    category_ID INT,
    main_ingredients VARCHAR(500),
    restaurant_ID INT,
    price VARCHAR(5),
    about VARCHAR(100),
    dish_image VARCHAR(500)
);

CREATE TABLE favourites (
    favourite_ID INT PRIMARY KEY AUTO_INCREMENT,
    customer_ID INT,
    restaurant_ID INT
);

CREATE TABLE categories (
    category_ID INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50)
);

CREATE TABLE images (
    image_ID INT PRIMARY KEY AUTO_INCREMENT,
    image_link VARCHAR(100),
    customer_ID INT DEFAULT 0,
    restaurant_ID INT DEFAULT 0,
    dish_ID INT DEFAULT 0
);