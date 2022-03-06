import express, {Request, Response} from 'express';
import {User, UserStore} from '../models/User';
import jwt from 'jsonwebtoken';
import { signToken, verifyToken } from '../utils/jwt';
const store = new UserStore();
const index = async (req: Request, res: Response) => {
    try{
        const users = await store.index()
        res.json(users);
    } catch(e){
        res.send(e);
    }
}

const show = async(req: Request, res: Response) => {
    try{
        const user = await store.show(req.params.id);
        res.send(user);
    } catch(e){
        res.send(e);
    }
}

const destroy = async(req: Request, res: Response) => {
    const deletedUser = await store.delete(req.params.id);
    res.send("Deleted");
}

const authenticate = async(req: Request, res: Response) => {
    const {email, password} = req.body;
    console.log(email, password);
    try{
        // const u = await store.authenticate(email, password);
        //const token = jwt.sign({user: u}, process.env.JWT_SECRET_KEY as string);

        const token = await store.authenticate(email, password);
        console.log(token);
        res.send(token);
    } catch(error){
        res.status(401).json(error);
    }
}
const signUp = async (req: Request, res: Response) => {
    const user: User = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        email: req.body.email
    }
    try{
        // const newUser=  await store.signUp(user);
        const token = await store.signUp(user);
        // const token = ({user: newUser}, process.env.JWT_SECRET_KEY as string);
        res.send(token);
    } catch(error){
        res.status(400).json({error});
    }
}


const mount = (app: express.Application) => {
    app.get('/users', verifyToken ,index); // worked
    app.get('/users/:id', verifyToken ,show); // worked
    // app.post('/users/signup', verifyToken , create);
    app.post('/users/login', authenticate); 
    app.delete('/users/:id', verifyToken, destroy);
    app.post('/users/signup', signUp);
}
export default mount;