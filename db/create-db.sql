DROP DATABASE IF EXISTS shop_db;

CREATE DATABASE IF NOT EXISTS shop_db;

USE shop_db;

DROP TABLE IF EXISTS credentials;

CREATE TABLE IF NOT EXISTS credentials (
    provider_id VARCHAR(40) PRIMARY KEY,
    provider_key VARCHAR(20),
    user_id VARCHAR(40) NOT NULL,
    hasher VARCHAR(10) NOT NULL,
    password_hash VARCHAR(200) NOT NULL,
    password_salt VARCHAR(10)
);

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(40) PRIMARY KEY,
    slug VARCHAR(25),
    name VARCHAR(50) NOT NULL,
    avatar VARCHAR(10),
    loacale JSON,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(10) DEFAULT 'user',
    age INT(10) DEFAULT 0,
    created_at DATE,
    updated_at DATE,
    bio VARCHAR(10),
    address VARCHAR(255),
    phoneNumber VARCHAR(50),
    company VARCHAR(50),
    is_active BIT DEFAULT 0,
    is_deleted BIT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS social_profiles (
    user_id VARCHAR(40) PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    platform_user VARCHAR(50),
    created_at DATE
);

DROP TABLE IF EXISTS categories;

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(40) PRIMARY KEY,
    parent_category VARCHAR(40),
    slug VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(20) UNIQUE NOT NULL,
    description VARCHAR(20) UNIQUE NOT NULL,
    tags JSON,
    created_at DATE,
    updated_at DATE
);

DROP TABLE IF EXISTS products;

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(40) PRIMARY KEY,
    category_id VARCHAR(40),
    title VARCHAR(200)
    slug VARCHAR(20) UNIQUE NOT NULL,
    picture VARCHAR(20),
    summary VARCHAR(20),
    description VARCHAR(20),
    price BIGINT,
    discount_type VARCHAR(20),
    discount_value BIGINT,
    tags JSON,
    created_at DATE,
    updated_at DATE,
    created_by VARCHAR(40)
);

DROP TABLE IF EXISTS reviews;

CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(40) PRIMARY KEY,
    user_id VARCHAR(40) NOT NULL,
    category_id VARCHAR(40),
    product_id VARCHAR(40),
    rating INT,
    comment VARCHAR(200),
    created_at DATE
);

DROP TABLE IF EXISTS carts;

CREATE TABLE IF NOT EXISTS carts (
    id VARCHAR(40) PRIMARY KEY,
    created_by VARCHAR(40) NOT NULL,
    status INT,
    created_at DATE,
    updated_at DATE,
    is_deleted BIT
);

DROP TABLE IF EXISTS orders;

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(40) PRIMARY KEY,
    user_id VARCHAR(40) NOT NULL,
    message VARCHAR(255),
    created_at DATE,
    is_deleted BIT,
    status INT
);

DROP TABLE IF EXISTS cart_items;

CREATE TABLE IF NOT EXISTS cart_items (
    cart_id VARCHAR(40) PRIMARY KEY,
    product_id VARCHAR(40) NOT NULL,
    price BIGINT,
    quantity INT,
    created_at DATE
);

DROP TABLE IF EXISTS order_lines;

CREATE TABLE IF NOT EXISTS order_lines (
    id VARCHAR(40) PRIMARY KEY,
    order_id VARCHAR(40) NOT NULL,
    product_id VARCHAR(40) NOT NULL,
    price BIGINT,
    quantity INT,
    status INT
);

DROP TABLE IF EXISTS delivers;

CREATE TABLE IF NOT EXISTS delivers (
    id VARCHAR(40) PRIMARY KEY,
    order_id VARCHAR(40) NOT NULL,
    status BIGINT,
    deliver_by VARCHAR(20),
    created_at DATE
);