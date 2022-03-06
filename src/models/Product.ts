import Client from '../config/db';

export type Product = {
    id?: number;
    name: string;
    price: number;
    category?: string;
}


export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const sql = 'select * from products';
            const conn = await Client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Unable to get products`);
        }
    }
    async show(id: string): Promise<Product> {
        try {
            const sql = 'select * from products where id=($1)';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to get product`)
        }
    }
    async create(p: Product): Promise<Product> {
        try {
            const {name, price, category} = p;
            const sql = 'insert into products (name, price, category) values ($1, $2, $3) returning *';
            const conn = await Client.connect();
            const result = await conn.query(sql, [name, price, category]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`unable to create product`)
        }
    }
    async getByCategory(category: string): Promise<Product[]>{
        try {
            const sql = 'SELECT * FROM products WHERE category=($1)';
            const conn = await Client.connect();
            const result = await conn.query(sql, [category]);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Unable to get Product`);
        }
    }
    async delete(id: string): Promise<Product> {
        try {
            const sql = 'delete from products where id=($1)';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to delete product`)
        }
    }
}