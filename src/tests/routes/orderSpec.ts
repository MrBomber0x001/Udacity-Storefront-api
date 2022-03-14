import { Product, ProductStore } from './../../models/Product';
import { UserStore, User } from './../../models/User';
import {Client} from '../../config/db';
import supertest from 'supertest';
let token1 = '';
const userStore = new UserStore();
const productStore = new ProductStore();
import app from '../../server';
const request = supertest(app);
describe('Testing Order CRUD API', () => {
    const user: User = {
        firstname: "test",
        lastname: "test2",
        email: "test@gmail.com",
        password: "test1234"
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
    it('should return 200 for creating order', async () => {
        const response = await request.post('/orders/create').set('Content-Type', 'application/json').set(`Authorization`, `Bearer ${token1}`).send({
            orderId: 1,
            status: "active",
            user_id: 1
        });
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            id: response.body.id,
            status: response.body.status,
            user_id: response.body.user_id
        })
    })
    it('should delete order', async() => {
        const response = await request.delete('/orders/1').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token1}`);
        expect(response.status).toBe(200);
        console.log(response.body);
    })

})