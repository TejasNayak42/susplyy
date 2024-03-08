CREATE TABLE user(
    id INT primary key AUTO_INCREMENT,
    name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(30),
    password VARCHAR(36),
    status VARCHAR(20),
    role VARCHAR(20),
    UNIQUE(email)
);

CREATE TABLE customer(
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100),
    city VARCHAR(20),
    region VARCHAR(300),
    country VARCHAR(36),
    postal_code VARCHAR(20),
    contact_no BIGINT(20),
    email VARCHAR(30),
    password VARCHAR(300),
    role VARCHAR(20),
    UNIQUE(email)
);



CREATE TABLE supplier(
    supplier_id INT primary key AUTO_INCREMENT,
    supplier_name VARCHAR(100),
    city VARCHAR(20),
    region VARCHAR(300),
    country VARCHAR(36),
    postal_code VARCHAR(20),
    contact_no BIGINT(20),
    email VARCHAR(30),
    password VARCHAR(300),
    role VARCHAR(20),
    UNIQUE(email)
);

CREATE TABLE shipper(
    shipper_id INT primary key AUTO_INCREMENT,
    shipper_name VARCHAR(100),
    city VARCHAR(20),
    region VARCHAR(300),
    country VARCHAR(36),
    postal_code VARCHAR(20),
    contact_no BIGINT(20),
    email VARCHAR(30),
    password VARCHAR(300),
    role VARCHAR(20),
    UNIQUE(email)
);

INSERT INTO user(name, phone, email, password, status, role) VALUES('Admin', '1111111111', 'admin@gmail.com', '111111', 'true', 'admin');

ALTER TABLE customer MODIFY COLUMN contact_no BIGINT(20);
ALTER TABLE supplier MODIFY COLUMN contact_no BIGINT(20);
ALTER TABLE shipper MODIFY COLUMN contact_no BIGINT(20);