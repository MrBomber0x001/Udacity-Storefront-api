import {Product, ProductStore} from '../models/Product';
import express, {Request, Response} from 'express';
import {verifyToken} from '../utils/jwt';
const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
    const products = await store.index();
    res.send(products);
}
const show = async (req: Request, res: Response) => {
    const product = await store.show(parseInt(req.params.id));
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
    const deletedProduct = await store.delete(parseInt(req.params.id));
    res.send(deletedProduct);
}
const updateProduct = async (req: Request, res: Response) => {
    //! create allowed updates
    const product: Product = {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    }
    const updatedProduct = await store.update(product);
    res.send(updatedProduct);
}
const getByCategory = async (req: Request, res: Response) => {
    const products = await store.getByCategory(req.params.category);
    return res.send(products);
}
const mount = (app: express.Application) => {
    app.get('/products/:category', verifyToken,getByCategory); // done
    app.get('/products', verifyToken, verifyToken, index); // done
    app.get('/products/:id', verifyToken, show); // done
    app.post('/products/create', verifyToken, createProduct); // done
    app.delete('/products/:id',verifyToken,  destroy); // done
    app.put('/products', verifyToken, updateProduct);  // done
    
}
export default mount;