import express, { Request, Response } from "express";
import { Order_Products, Order_Products_Store } from "../models/Order_Products";
import { verifyToken } from "../utils/jwt";
const store=  new Order_Products_Store();
const index = async (req: Request, res: Response) => {
    try{
        const productsOnOrder = await store.index(parseInt(req.params.orderId));
        res.json(productsOnOrder)   
    } catch(e){
        res.status(400).send(`${e}`);
    }
 
}

const remove = async (req: Request, res: Response) => {
    try{
        const removed = await store.delete(parseInt(req.params.orderId), parseInt(req.params.productId));
        res.send(removed);
    } catch (e){
        res.status(400).send(`${e}`);
    }
}
const update = async (req: Request, res: Response) => {
try {
    const orderProduct: Order_Products = {
        quantity: req.body.quantity,
        orderId: req.body.orderId,
        productId: req.body.productId
    }
    const updated = await store.update(orderProduct, parseInt(req.params.orderId));
    res.send(updated);
} catch (error) {
    res.status(400).send(`${error}`);
}
}
const show = async (req: Request, res: Response) => {
    try{
        const productsInOrder = await store.show(parseInt(req.params.orderId), parseInt(req.params.productId));
        res.send(productsInOrder);
    } catch(e){
        res.send(`${e}`);
    }

}
const mount = (app: express.Application) => {
    app.get('/order-products/:orderId/products/:productId', verifyToken,show);
    app.get('/order-products/:orderId/products', verifyToken ,index);
    app.put('/orders-products/:orderId/', verifyToken,update);
    app.delete('/order-products/:orderId/:productId', verifyToken ,remove )
}
export default mount;