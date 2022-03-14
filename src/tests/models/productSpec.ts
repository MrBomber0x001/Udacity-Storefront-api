import { Client } from './../../config/db';
import {Product, ProductStore} from '../../models/Product';
const store = new ProductStore();

describe('Product Model', () => {
    describe("Product Model Methods Existence", () => {
        it('should have index method', () => {
            expect(store.index).toBeDefined();
        })
        it('should have show method', () => {
            expect(store.show).toBeDefined();
        })
        it('should have create method', () => {
            expect(store.create).toBeDefined();
        })
        it('should have getByCategory method', () => {
            expect(store.getByCategory).toBeDefined();
        })
        it('should have delete method', () => {
            expect(store.delete);
        })
    })
    
    describe('Product Operations', () => {
        afterAll(async () => {
            const sql = 'DELETE FROM products;\n ALTER SEQUENCE products_id_seq RESTART WITH 1';
            const conn = await Client.connect();
            await conn.query(sql);
            conn.release();
        })
        const product: Product = {
            name: "Olivia",
            price: 10,
            category: "health",
        }
        it('should create product', async() => {
            const newProduct = await store.create(product)
            expect(newProduct).toEqual({
                id: newProduct.id,
                name: newProduct.name,
                category: newProduct.category,
                price: newProduct.price
            })
        })
        it('should list all products', async() => {
            const result: Product[] = await store.index();
            expect(result).toEqual([{
                id: result[0].id,
                name: result[0].name,
                price: result[0].price,
                category: result[0].category
            }])
        })
        it('should get one product by id', async () => {
            const result: Product = await store.show(1);
            expect(result).toEqual({
                id: result.id,
                name: result.name,
                price: result.price,
                category: result.category
            })
        })
        it('should get products by category', async () => {
            const products: Product[] = await store.getByCategory("health");
            expect(products).toEqual([{
                id: products[0].id,
                name: products[0].name,
                price: products[0].price,
                category: products[0].category
            }])
        })
        it('should delete product', async () => {
            const deletedProduct = await store.delete(1);
            expect(deletedProduct).toEqual({
                id: deletedProduct.id,
                name: deletedProduct.name,
                price: deletedProduct.price,
                category: deletedProduct.category
            })
        })
    })
})