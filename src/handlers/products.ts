import {Product, ProductStore} from '../models/Product';
import express, {Request, Response} from 'express';
import {verifyToken} from '../utils/jwt';
const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
    try {
        const products = await store.index();
        res.send(products);
    } catch (error) {
        res.status(400).send(`${error}`);
    }
}
const show = async (req: Request, res: Response) => {
    try {
        const product = await store.show(parseInt(req.params.id));
        res.send(product);
    } catch (error) {
        res.status(400).send(`${error}`);
    }

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
    try{
        const deletedProduct = await store.delete(parseInt(req.params.id));
        res.send(deletedProduct);
    } catch(e){
        res.status(400).send(`${e}`);
    }
}
const updateProduct = async (req: Request, res: Response) => {
    //! create allowed updates
    const product: Product = {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    }
    try{
        const updatedProduct = await store.update(product);
        res.send(updatedProduct);
    } catch(e){
        res.status(400).send(`${e}`);
    }
}
const getByCategory = async (req: Request, res: Response) => {
    try {
        const products = await store.getByCategory(req.params.category);
        return res.send(products);
    } catch (error) {
        res.status(400).send(`${error}`);
    }
}
const mount = (app: express.Application) => {
    app.get('/products/:id', show); 
    app.get('/products/:category', verifyToken,getByCategory); // done
    app.get('/products', index); 
    app.post('/products/create', verifyToken, createProduct); 
    app.delete('/products/:id',verifyToken,  destroy); 
    app.put('/products', verifyToken, updateProduct);  
    
}
export default mount;