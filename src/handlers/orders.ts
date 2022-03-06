import express, {Request, Response} from 'express';
import {Order, OrderStore} from '../models/Order';
import { verifyToken } from '../utils/jwt';
const store = new OrderStore();
const index = async (req: Request, res: Response) => {
    const orders = await store.index();
    res.json(orders);
}
const create = async (req: Request, res: Response) => {
    const order: Order = {
          product_id: req.body.product_id,
          user_id: req.body.user_id,
          quantity: parseInt(req.body.quantity),
          status: req.body.status  
    };
    try{
        const newOrder = await store.create(order);
        res.send(newOrder);
    } catch (err){
        res.status(400).send(err);
    }

}
const show = async (req: Request, res: Response) => {
    const order = await store.show(req.params.id);
    if(!order){
        return res.json({msg: "There is no orders"})
    }
    res.json(order);
}
const getCurrentOrders = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId)
    const orders = await store.getCurrentOrder(userId);
    return res.json(orders);
}
const getOpenedOrders = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const orders = await store.getOpenedOrderByUser(userId);
    return res.json(orders);
}
const getClosedOrders = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const orders = await store.getClosedOrderByUser(userId);
    return res.json(orders)
}
const addProduct = async (req: Request, res: Response) => {
    const orderId: number = parseInt(req.params.id);
    const productId: number = parseInt(req.body.productId);
    const qunatity: number = parseInt(req.body.qunatity);
    try{
        const addedProduct = await store.addProduct(qunatity, orderId, productId);
        res.json(addedProduct);
    } catch(e){
        res.status(400);
        res.json(e);
    }
}
const deleteOne = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.params.id);
    return res.json(deleted);
}
const update = async (req: Request, res: Response) => {
    const status: string | undefined = req.query.status as string;
    const updatedOrder = await store.updateOrder(status, parseInt(req.params.id));
    res.json(updatedOrder);
}
const orderRoutes = (app: express.Application) => {
    app.get('/orders', verifyToken, index); // done
    app.get('/orders/:id', verifyToken,show); // done
    app.get('/orders/current/:userId', verifyToken,getCurrentOrders); // done
    app.get('/orders/open/:userId', verifyToken,getOpenedOrders); // done
    app.get('/orders/closed/:userId', verifyToken,getClosedOrders) // done
    app.post('/orders/:id/products', verifyToken,addProduct);
    app.post('/orders/create', create); // done
    app.delete('/orders/:id', verifyToken, deleteOne); // done
    app.put('/orders/:id', update); // done
}
export default orderRoutes;