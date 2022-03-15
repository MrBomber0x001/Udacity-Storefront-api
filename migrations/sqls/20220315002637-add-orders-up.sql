/* Replace with your SQL commands */
CREATE TABLE orders (
    id serial PRIMARY key,
    status VARCHAR(50),
    user_id int references users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
