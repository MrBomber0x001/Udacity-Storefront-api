import {Product, ProductStore} from '../models/Product';
import express, {Request, Response} from 'express';
import {verifyToken} from '../utils/jwt';
const store = new ProductStore();

const index = async (req: Request, res: Response) => {
    const products = await store.index();
    res.send(products);
}
const show = async (req: Request, res: Response) => {
    const product = await store.show(req.params.id);
    res.send(product);
}
const createProduct = async (req: Request, res: Response) => {
    const product: Product = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    }
    try{
        const newProduct = await store.create(product);
        res.send(newProduct);
    } catch(error){
        res.send(400).json({msg: "can't create product"})
    }
}
const destroy = async(req: Request, res: Response) => {
    await store.delete(req.params.id);
    res.send("Deleted");
}
const getByCategory = async (req: Request, res: Response) => {
    const products = await store.getByCategory(req.params.category);
    return res.send(products);
}
const mount = (app: express.Application) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products/create', verifyToken, createProduct);
    app.delete('/products/:id', destroy);
    app.get('/products/cat/:category', getByCategory);
}
export default mount;