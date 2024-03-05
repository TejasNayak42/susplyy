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

INSERT INTO user(name, phone, email, password, status, role) VALUES('Admin', '1111111111', 'admin@gmail.com', '111111', 'true', 'admin');