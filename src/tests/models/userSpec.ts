import { Client } from './../../config/db';
import { User, UserStore } from '../../models/User';
describe('User Model', () => {
    const store = new UserStore();
    describe("User Model Methods Existence", () => {
        it('should have index method', () => {
            expect(store.index).toBeDefined();
        })
        it('should have show method', () => {
            expect(store.show).toBeDefined();
        })
        it('should have signup method', () => {
            expect(store.signUp).toBeDefined();
        })
        it('should have delete method', () => {
            expect(store.delete).toBeDefined();
        })
        it('should have authenticate method', () => {
            expect(store.authenticate).toBeDefined();
        })
    });

    describe('User Operations', () => {
        const user: User = {
            email: "yousef@gmail.com",
            firstname: "yousef",
            lastname: "meska",
            password: "4cex01bk",
        }
        // beforeAll(async () => {
        //     const conn = await Client.connect();
        //     const sql = 'DELETE FROM users; \nALTER SEQUENCE users_id_seq RESTART WITH 1';
        //     await conn.query(sql);
        //     conn.release();
        // })
        afterAll(async () => {
            const conn = await Client.connect();
            const sql = 'DELETE FROM users; \nALTER SEQUENCE users_id_seq RESTART WITH 1';
            await conn.query(sql);
            conn.release();
        })
        it('should create user', async () => {
            const newUser = await store.create(user);
            expect(newUser).toEqual({
                id: newUser.id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                password: newUser.password,
                email: newUser.email
            })
        })
        it('should show user with id 1', async () => {
            const newUser = await store.show(1);
            expect(newUser).toEqual({
                id: newUser.id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                password:  newUser.password,
                email:  newUser.email
            })
        })
        it('should list all users', async () => {
            const users: User[] = await store.index();
            expect(users).toEqual([{
                id: users[0].id,
                firstname: users[0].firstname,
                lastname: users[0].lastname,
                password: users[0].password,
                email: users[0].email
            }])
        })
        it('should delete user with id 1', async () => {
            const deleted = await store.delete(1);
            expect(deleted).toEqual({
                id: deleted.id,
                firstname: deleted.firstname,
                lastname: deleted.lastname,
                password: deleted.password,
                email: deleted.email
            })
        })
    })
})