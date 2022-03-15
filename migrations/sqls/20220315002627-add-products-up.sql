/* Replace with your SQL commands */
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) not null,
    price NUMERIC(18, 2) not null,
    category VARCHAR(50) not null
);