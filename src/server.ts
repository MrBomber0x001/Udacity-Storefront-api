import express, {ErrorRequestHandler, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';
import dashboardRoutes from './handlers/dashboard';
import morgan from 'morgan';
import helmet from 'helmet';
import orderProducts from './handlers/orderProducts';
/* Configuration */
dotenv.config();
const app: express.Application = express();
const PORT = process.env.APP_PORT || 3000;
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('short'));

/* Routes */
app.get('/home', (req: Request, res: Response) => {
    res.render('home');
})
orderRoutes(app);
productRoutes(app);
userRoutes(app);
orderProducts(app);
dashboardRoutes(app);


/** Error Middleware */
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.send(err);
})
/* initiating server */

app.listen(PORT, () => {
    console.log("Server is running")
})
export default app;