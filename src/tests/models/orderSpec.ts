import { Client } from './../../config/db';
import { ProductStore, Product } from '../../models/Product';
import { UserStore, User } from '../../models/User';
import { Order, OrderStore} from '../../models/Order';

const store = new OrderStore();

describe("Order Model", () => {
    describe("Order Model Methods Existence", () => {
        it('should have an index method', () => {
            expect(store.index).toBeDefined();
        })
        it('should have a show method', () => {
            expect(store.show).toBeDefined();
        });
        it('should have create method', () => {
            expect(store.create).toBeDefined();
        })
        it('should have delete method', () => {
            expect(store.delete).toBeDefined();
        })
        it('should have getCurrentOrder method', () => {
            expect(store.getCurrentOrder).toBeDefined();
        })
        it('should have getClosedOrderByUser method', () => {
            expect(store.getClosedOrderByUser).toBeDefined();
        })
        it('should have getOpenedOrderByUser method', () => {
            expect(store.getOpenedOrderByUser).toBeDefined();
        })
        it('should have updateOrder method method', () => {
            expect(store.updateOrder).toBeDefined();
        })
    })

    describe("Order Model Operations", () => {
        const userStore = new UserStore();
        const productStore = new ProductStore();
        const user: User = {
            email: "yousef@gmail.com",
            firstname: "yousef",
            lastname: "meska",
            password: "4cex01bk",
        }
        const product: Product = {
            name: "Olivia",
            price: 10,
            category: "health",
        }
        const order: Order = {
            user_id: 1,
            status: "open",
        }
        beforeAll(async () => {
            const userCreated = await userStore.create(user);
            const productCreated = await productStore.create(product);
        })

        afterAll(async () => {
            const sql = 'DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM products;\nALTER SEQUENCE products_id_seq RESTART WITH 1;\nDELETE FROM orders;\nALTER SEQUENCE orders_id_seq RESTART WITH 1';
            const conn = await Client.connect();
            await conn.query(sql);
            conn.release();
        })

        it('should create order for user 1 with status open', async() => {
            const result = await store.create({
                user_id: 1,
                status: "open"
            });
            expect(result).toEqual({
                id: result.id,
                user_id: result.user_id,
                status: result.status
            })
        })
        it('should get one order', async()=>{
            const result = await store.show(1);
            expect(result).toEqual({
                id: result.id,
                status: result.status,
                user_id: result.user_id
            });
        })
        it('should get current order for userId 1', async() => {
            const result = await store.getCurrentOrder(1);
            expect(result).toEqual({
                id: result.id,
                user_id: result.user_id,
                status: result.status,
            });
        })
    })  
})
