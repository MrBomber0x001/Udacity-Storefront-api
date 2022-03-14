import {Product} from './Product';
import {Client} from '../config/db';
export type Order_Products = {
    id?: number;
    quantity: number;
    productId: number;
    orderId: number;
    products?: Product[];
}
export class Order_Products_Store {
    async create (orderProduct: Order_Products): Promise<Order_Products>{
        try {
            const {productId, orderId, quantity} = orderProduct; 
            const sql = 'INSERT INTO order_products (product_id, order_id, quantity) values ($1, $2, $3) RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [productId, orderId, quantity]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to add product ${orderProduct.productId} to the order ${orderProduct.orderId}`);
        }
    }

    async index(orderId: number): Promise<Order_Products[]>{
        try {
            const conn = await Client.connect();
            const sql = "SELECT o.id AS id, op.order_id, op.product_id, JSON_AGG(JSONB_BUILD_OBJECT('productId', p.id, 'name', p.name, 'category', p.category, 'price', p.price, 'quantity', op.quantity)) AS products FROM orders AS o LEFT JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id WHERE o.id=$1 GROUP BY o.id, op.order_id, op.product_id";
            const result = await conn.query(sql, [orderId]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`${error}`)
        }
    }
    async show(orderId: number, productId: number): Promise<Order_Products>{
        const sql = 'SELECT op.order_id::INTEGER AS id, op.order_id::INTEGER AS "orderId", op.product_id::INTEGER AS "productId", op.quantity, p.name, p.category, p.price::INTEGER FROM order_products AS op JOIN products AS p ON p.id=op.product_id WHERE order_id=$1 AND product_id=$2';
        const conn = await Client.connect();
        const result = await conn.query(sql, [orderId, productId]);
        return result.rows[0];
    }
    //removing product from order;
    async delete(orderId: number, productId: number): Promise<Order_Products>{
      try {
        const conn = await Client.connect();
        const sql = 'DELETE FROM order_products WHERE order_id=($1) and product_id=($2) RETURNING *';
        const result = await conn.query(sql, [orderId, productId]);
        conn.release();
        return result.rows[0];
      } catch (error) {
          throw new Error(`Unable to delete product: ${productId} from order ${orderId}`);
      }
    }
    async update(op: Order_Products, orderId: number): Promise<Order_Products>{
       try {
        const {quantity, productId} = op;
        const conn = await Client.connect();
        const sql = 'UPDATE order_products SET quantity=$1, order_id=$2, product_id=$3 WHERE id=$4 RETURNING *';
        const  result = await conn.query(sql, [quantity, orderId, productId, orderId]);
        conn.release();
        return result.rows[0];
       } catch (error) {
           throw new Error(`Unable to edit product in the order`)
       }
    }
}