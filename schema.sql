DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(45) NOT NULL,
    product_sales DECIMAL(10, 2) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments(
department_id INT AUTO_INCREMENT NOT NULL,
department_name VARCHAR(45) NOT NULL,
over_head_costs INT NOT NULL,
PRIMARY KEY (department_id)
);


SELECT * FROM products;

SELECT * FROM departments;
