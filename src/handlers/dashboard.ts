import express, {Request, Response} from 'express';
import { Dashboard } from '../services/Dashboard';

const dashboardRoutes = (app: express.Application) => {
    app.get('/products_in_orders', productsInOrders);
    app.get('/most_expensive_products', getMostExpensiveProducts);
    app.get('/users_with_orders', usersWithOrders);
}

const dashboard = new Dashboard();


const getMostExpensiveProducts = async(req: Request, res: Response) => {
    const products = await dashboard.getMostExpensiveProducts();
    res.json();
}

const usersWithOrders = async(req: Request, res: Response) => {
    const users = await dashboard.usersWithOrders();
    res.json(users);
}

const productsInOrders = async(req: Request, res: Response) => {
    const products = await dashboard.productsInOrder();
    res.json(products);
}

export default dashboardRoutes;