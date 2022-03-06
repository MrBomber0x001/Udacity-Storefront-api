import Client from '../config/db';

export type Order = {
    id?: string;
    status?: string;
    product_id: number,
    user_id: number,
    quantity: number
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
    async show(id: string): Promise<Order>{
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
    async create(o: Order): Promise<Order>{
        try {
            const {product_id, quantity, user_id, status} = o;
            console.log("hit");
            const sql = 'INSERT INTO orders (product_id, user_id, quantity, status) VALUES ($1, $2, $3, $4) RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [product_id, user_id, quantity, status]);
            conn.release();
            console.log("hit 2");
            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot create Order`);
        }
    }
    async delete(id: string): Promise<Order>{
        try {
            const sql = 'DELETE FROM orders WHERE id=($1)';
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