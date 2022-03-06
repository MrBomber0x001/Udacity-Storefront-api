import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';
import dashboardRoutes from './handlers/dashboard';
import morgan from 'morgan';
import path from 'path';


/* Configuration */
const app: express.Application = express();
dotenv.config();
const PORT = process.env.APP_PORT || 8000;
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + 'public'));
app.use(morgan('short'));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname + "views"));


/* Routes */
app.get('/home', (req: Request, res: Response) => {
    res.render('home');
})
orderRoutes(app);
productRoutes(app);
userRoutes(app);
dashboardRoutes(app);

/* initiating server */

app.listen(PORT, () => {
    console.log("Server is running")
})