import express, {Request, Response} from 'express';
import { Dashboard } from '../services/Dashboard';

const dashboardRoutes = (app: express.Application) => {
    app.get('/products_in_orders', productsInOrders);
    app.get('/most_expensive_products', getMostExpensiveProducts);
    app.get('/users_with_orders', usersWithOrders);
}

const dashboard = new Dashboard();


const getMostExpensiveProducts = async(req: Request, res: Response) => {
    try{
        const products = await dashboard.getMostExpensiveProducts();
        res.json(products);
    } catch(e){
        res.status(400).send(`${e}`);
    }

}

const usersWithOrders = async(req: Request, res: Response) => {
    try{
        const users = await dashboard.usersWithOrders();
        res.json(users);
    } catch(e){
        res.status(400).send(`${e}`);
    }
}

const productsInOrders = async(req: Request, res: Response) => {
    try{
        const products = await dashboard.productsInOrder();
        res.json(products);
    } catch (e){
        res.status(400).send(`${e}`);
    }
}

export default dashboardRoutes;

