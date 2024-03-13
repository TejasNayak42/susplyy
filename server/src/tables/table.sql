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

CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  image_url VARCHAR(4000),
  status VARCHAR(255) DEFAULT 'false',
  FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id)
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  product_id INT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
  date DATE NOT NULL DEFAULT (CURRENT_DATE),
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  quantity INT NOT NULL 
);

CREATE TABLE shipments (
  shipment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  shipper_id INT NOT NULL,  
  shipment_date DATE NOT NULL,
  shipment_status VARCHAR(255) DEFAULT 'dispatched',
  delivery_date DATE NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  FOREIGN KEY (shipper_id) REFERENCES shipper(shipper_id)  
);

CREATE TABLE tracks (
  track_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  customer_id INT NOT NULL,
  shipment_id INT NOT NULL,
  tracking_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  tracking_status VARCHAR(255) DEFAULT 'Created',
  customer_contact_no VARCHAR(20),
  customer_city VARCHAR(255),
  customer_region VARCHAR(255),
  customer_country VARCHAR(255),
  customer_postal_code VARCHAR(20),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
  FOREIGN KEY (shipment_id) REFERENCES shipments(shipment_id)
);