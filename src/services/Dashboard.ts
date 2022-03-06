import Client from "../config/db";

export class Dashboard{
    async getMostExpensiveProducts(): Promise<{name: string, price: number, order_id: string}[]>{
        try{
            const conn = await Client.connect();
            const sql = 'SELECT name, price FROM products ORDER BY price DESC LIMIT 5';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch(e){
            throw new Error(`cannot get products ${e}`);
        }
    }
    /**
     * @params void
     * @returns list of products on orders
     */
    async productsInOrder(): Promise<{name: string, price: number, order_id: string}[]>{
        try{
            const conn = await Client.connect();
            const sql = 'SELECT name, price. order_id from products INNER JOIN order_products on products.id = order_products.product_id';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch(e){
            throw new Error(`cannot get products in order`)
        }
    }
    async getProductInOrder(orderId: string): Promise<{name: string, price: number, order_id: string}>{
        try{
            const conn = await Client.connect();
            const sql = 'SELECT name, price. order_id from products INNER JOIN order_products on products.id = order_products.product_id where order_id=($1)';
            const result = await conn.query(sql, [orderId]);
            conn.release();
            return result.rows[0];
        } catch(e){
            throw new Error(`cannot get products in order`)
        }
    } 
    async usersWithOrders(): Promise<{firstname: string, lastname: string}[]>{
        try{
            const conn = await Client.connect();
            const sql = 'SELECt firstname, lastname from users INNER JOIN orders on users.id = orders.user_id';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch(e){
            throw new Error('unable to get users orders');
        }
    }
}