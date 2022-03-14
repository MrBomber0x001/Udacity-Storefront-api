import { Response } from 'express';
import {Client} from '../../config/db';
import { User, UserStore } from '../../models/User';
import app from '../../server';
import supertest from 'supertest';
const request = supertest(app);
const userStore = new UserStore();
let token = '';
describe("Testing User API", () => {
    const user: User = {
        email: "mrbomberboy123@gmail.com",
        firstname: "Yousef",
        lastname: "Meska",
        password: "4cex01bk",
    }

    afterAll(async () => {
        const conn = await Client.connect();
        const SQL = 'DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM orders;\nALTER SEQUENCE orders_id_seq RESTART WITH 1';
        await conn.query(SQL);
        conn.release();
    })
    it('should return 200 ok for creating', async () => {
        const response = await request.post('/users/signup').set('Content-Type', 'application/json')
        .send(user)
        expect(response.status).toBe(200);
    })
    it('should authenticate a user', async () => {
        const response = await request.post('/users/login').set('Content-Type', 'application/json').send({email: "mrbomberboy123@gmail.com", password: "4cex01bk"});
        expect(response.status).toBe(200);
        token = response.body.token;
    })
    it('should delete a user', async() => {
        const response = await request.delete('/users/1').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
    })
})