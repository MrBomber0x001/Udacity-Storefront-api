import express, {Request, Response} from 'express';
import {Order, OrderStore} from '../models/Order';
import { verifyToken } from '../utils/jwt';
//! Handle try and catch for each route
const store = new OrderStore();
const index = async (req: Request, res: Response) => {
    const orders = await store.index();
    res.json(orders);
}
const create = async (req: Request, res: Response) => {
    const order: Order = {
          user_id: req.body.user_id,
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
    const order = await store.show(parseInt(req.params.id));
    res.json(order);
}
const showDetailed = async (req: Request, res: Response) => {
    const order = await store.showDetailed(parseInt(req.params.id));
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
    const deleted = await store.delete(parseInt(req.params.id));
    return res.json(deleted);
}
const update = async (req: Request, res: Response) => {
    const status: string | undefined = req.query.status as string;
    const updatedOrder = await store.updateOrder(status, parseInt(req.params.id));
    res.json(updatedOrder);
}
const indexDetailed = async (req: Request, res: Response) => {
    const orders = await store.indexDetailed();
    res.json(orders);
}
const getAllOrders = async (req: Request, res: Response) => {
    const orders = await store.getAllOrdersrByUserId(parseInt(req.params.userId));
    res.json(orders);
}
const getDetailedOpenedOrders = async (req: Request, res: Response) => {
    const openedOrders = await store.getDetailedOpenedOrders(parseInt(req.params.userId));
    res.json(openedOrders);
}
const getDetailedClosedOrders = async (req: Request, res: Response) => {
    const closedOrders = await store.getDetailedClosedOrders(parseInt(req.params.userId));
    res.json(closedOrders);
}
const orderRoutes = (app: express.Application) => {
    app.get('/orders', verifyToken, index); // done
    app.get('/orders/indexDetailed', verifyToken, indexDetailed) // done
    app.get('/orders/:id',verifyToken, show);  //done
    app.get('/orders/users/current/:userId',verifyToken, getCurrentOrders); // done
    app.get('/orders/show-detailed/:id', verifyToken, showDetailed); // done
    app.delete('/orders/:id', verifyToken,deleteOne); // done
    app.get('/orders/users/open/:userId', verifyToken,getOpenedOrders);  //done
    app.get('/orders/users/open/detailed/:userId', verifyToken,getDetailedOpenedOrders); // done
    app.get('/orders/users/closed/:userId', verifyToken, getClosedOrders) // done
    app.get('/orders/users/:userId', verifyToken, getAllOrders); // done
    app.get('/orders/users/closed/detailed/:userId', verifyToken,getDetailedClosedOrders); // done
    app.post('/orders/create', verifyToken, create); // done

    app.put('/orders/:id', update); 

}
export default orderRoutes;