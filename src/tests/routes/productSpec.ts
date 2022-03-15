import { Product, ProductStore } from './../../models/Product';
import { UserStore, User } from './../../models/User';
import {Client} from '../../config/db';
import supertest from 'supertest';
let token1 = '';
const userStore = new UserStore();
const productStore = new ProductStore();
import app from '../../server';
const request = supertest(app);

describe('Product API', () => {
    const user: User = {
        firstname: "test",
        lastname: "test2",
        email: "test@gmail.com",
        password: "test1234"
    }
    const product: Product = {
        name: "product_test",
        price: 12,
        category: "product_category"
    }
    beforeAll(async () => {
       const {token} = await userStore.signUp(user);
       token1 = token;
    })

    afterAll(async () => {
        const conn = await Client.connect();
        const sql = 'DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM products;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;\nDELETE FROM orders;\nALTER SEQUENCE orders_id_seq RESTART WITH 1;';
        await conn.query(sql);
        conn.release();
    })
    it('should returns 200 ok creating a product', async () => {
        const response = await request.post('/products/create').set('Content-Type', 'application/json').set(`Authorization`, `Bearer ${token1}`).send(product);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
    })
    it('should returns 200 ok showing one product', async () => {
        const response = await request.get('/products').set('Content-Type', 'application/json').set(`Authorization`, `Bearer ${token1}`);
        expect(response.status).toBe(200);
    })
    it('should returns a 200 ok showing list of products', async () => {
        const response = await request.get('/products/1').set('Content-Type', 'application/json').set(`Authorization`, `Bearer ${token1}`)
        expect(response.status).toBe(200);
    })
    it('should delete a product', async () => {
        const response = await request.delete('/products/1').set(`Content-Type`, 'application/json').set(`Authorization`, `Bearer ${token1}`)
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
    })
})