/* Replace with your SQL commands */
CREATE TABLE order_products (
    id serial PRIMARY key,
    order_id int references orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id int references products(id) ON DELETE CASCADE ON UPDATE CASCADE,
    quantity int
)
