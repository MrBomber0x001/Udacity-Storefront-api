import {Client} from '../config/db';
import { Order_Products } from './Order_Products';
export type Order = {
    id?: number;
    status?: string;
    user_id: number,
    username?: string
    products?: Order_Products[];
}

export class OrderStore {
    async index(): Promise<Order[]>{
        try {
            const sql = 'SELECT * FROM orders';
            const conn = await Client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Unable to get list of Orders`);
        }
    }
    async show(id: number): Promise<Order>{
        try {
            const sql = 'SELECT * FROM orders where id=($1)';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to get order`);
        }
    }

    async showDetailed(id: number): Promise<Order> {
        try {
          const sql =
            "SELECT o.id AS id, u.firstname, o.user_id, JSON_AGG(JSONB_BUILD_OBJECT('productId', p.id, 'name', p.name, 'category', p.category, 'price', p.price, 'quantity', op.quantity)) AS products,  o.status AS status FROM orders AS o LEFT JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id WHERE o.id =($1) GROUP BY o.id, u.firstname, o.status, o.user_id";
    
          const conn= await Client.connect();
    
          const result = await conn.query(sql, [id]);
    
          conn.release();
          return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to get Order for ${id}`)
        }
      }
      async indexDetailed(): Promise<Order[]> {
        try {
          const conn = await Client.connect();

          const sql =
          "SELECT o.id AS id, u.firstname, o.user_id, JSON_AGG(JSONB_BUILD_OBJECT('productId', p.id, 'name', p.name, 'category', p.category, 'price', p.price, 'quantity', op.quantity)) AS products,  o.status AS status FROM orders AS o LEFT JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id GROUP BY o.id, u.firstname, o.status, o.user_id";
          const result = await conn.query(sql);
          conn.release();
          return result.rows;
        } catch (err) {
          throw new Error(`Unable to get orders`);
        }
      }
    async create(o: Order): Promise<Order>{
        try {
            const {user_id, status} = o;
            const sql = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [user_id, status]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot create Order`);
        }
    }
    async delete(id: number): Promise<Order>{
        try {
            const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Could not delete order: ${error}`);
        }
    }
    async getCurrentOrder(userId: number): Promise<Order>{
        try {
            const sql = 'SELECT * FROM orders WHERE user_id=($1) ORDER BY id DESC LIMIT 1'; //TODO: order by placed_time
            const conn = await Client.connect();
            const result = await conn.query(sql, [userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to get Order`);
        }
    }
    async getClosedOrderByUser(userId: number): Promise<Order[]>{
        try {
            const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='closed'";
            const conn = await Client.connect();
            const result = await conn.query(sql, [userId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Unable to get Closed Orders`);
        }
    }
    async getOpenedOrderByUser(userId: number): Promise<Order[]>{
        try {
            const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='open'";
            const conn = await Client.connect();
            const result = await conn.query(sql, [userId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Unable to get Opended Orders`);
        }
    }
    //TODO: redo implementation of addProduct
    async addProduct(quantity: number, orderId: number, productId: number): Promise<Order>{
        try {
            const orderSql = 'SELECT * FROM orders WHERE id=($1)';
            const conn = await Client.connect();
            const result = await conn.query(orderSql, [orderId]);
            const order = result.rows[0];
            if(order.status !== 'open'){
                throw new Error(`Could not add product: ${productId} to order: ${orderId} because order is closed!`);
            }
            conn.release();
        } catch (error) {
            throw new Error(`${error}`);
        }
        try{
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3)'
            const conn = await Client.connect();
            const result = await conn.query(sql, [quantity, orderId, productId]);
            conn.release();
            return result.rows[0];
        } catch(e){
            throw new Error(`Could not add product ${productId} to order: ${orderId}`);
        }
    }
    async getAllOrdersrByUserId(userId: number): Promise<Order[]> {
        try {
          const sql =
            "SELECT o.id AS id, u.firstname, o.user_id, JSON_AGG(JSONB_BUILD_OBJECT('productId', p.id, 'name', p.name,'category', p.category, 'price', p.price, 'quantity', op.quantity)) AS products, o.status AS status FROM orders AS o LEFT JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id WHERE o.user_id = $1 GROUP BY o.id, u.firstname, o.status, o.user_id";
    
          const conn = await Client.connect();
          const result = await conn.query(sql, [userId]);
    
          conn.release()
          return result.rows;
        } catch (err) {
          throw new Error(`Unable to get order for user: ${userId}`)
        }
      }
      async getDetailedOpenedOrders(userId: number): Promise<Order[]>{
        try {
            const sql =
              "SELECT o.id AS id, u.firstname, o.user_id, JSON_AGG(JSONB_BUILD_OBJECT('productId', p.id, 'name', p.name,'category', p.category, 'price', p.price, 'quantity', op.quantity)) AS products, o.status AS status FROM orders AS o LEFT JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id WHERE o.user_id = $1 AND status='open' GROUP BY o.id, u.firstname, o.status, o.user_id";
      
            const conn = await Client.connect();
            const result = await conn.query(sql, [userId]);
      
            conn.release()
            return result.rows;
          } catch (err) {
            throw new Error(`Unable to get order for user: ${userId}`)
          }
      }
      async getDetailedClosedOrders(userId: number): Promise<Order[]>{
        try {
            const sql =
              "SELECT o.id AS id, u.firstname, o.user_id, JSON_AGG(JSONB_BUILD_OBJECT('productId', p.id, 'name', p.name,'category', p.category, 'price', p.price, 'quantity', op.quantity)) AS products, o.status AS status FROM orders AS o LEFT JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id WHERE o.user_id = $1 AND status='closed' GROUP BY o.id, u.firstname, o.status, o.user_id";
      
            const conn = await Client.connect();
            const result = await conn.query(sql, [userId]);
      
            conn.release()
            return result.rows;
          } catch (err) {
            throw new Error(`Unable to get order for user: ${userId}`)
          }
      }
    
    async updateOrder(status: string | undefined, orderId: number): Promise<Order>{
        try {
            const conn = await Client.connect();
            const sql = 'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *';
            const result = await conn.query(sql, [status, orderId]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to update status`);
        }
    }
}