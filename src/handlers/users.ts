import express, {Request, Response} from 'express';
import {User, UserStore} from '../models/User';
import { verifyToken } from '../utils/jwt';
const store = new UserStore();
const index = async (req: Request, res: Response) => {
    try{
        const users = await store.index()
        res.json(users);
    } catch(e){
        res.send(e);
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const {firstname, lastname, password, email} = req.body;
        const user: User = {
            firstname, 
            lastname,
            email,
            password
        }
        const createdUser = await store.create(user);
        res.json(createdUser);
    } catch (error) {
        res.status(400).send({msg: "cannot create user"});
    }
}
const show = async(req: Request, res: Response) => {
    try{
        const user = await store.show(parseInt(req.params.id));
        res.send(user);
    } catch(e){
        res.send(e);
    }
}

const destroy = async(req: Request, res: Response) => {
    const deletedUser = await store.delete(parseInt(req.params.id));
    res.send(deletedUser);
}

const authenticate = async(req: Request, res: Response) => {
    const {email, password} = req.body;
    console.log(email, password);
    try{
        // const u = await store.authenticate(email, password);
        //const token = jwt.sign({user: u}, process.env.JWT_SECRET_KEY as string);

        const token = await store.authenticate(email, password);
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
        // const token = await store.signUp(user);
        // const token = ({user: newUser}, process.env.JWT_SECRET_KEY as string);
        const createdUser = await store.signUp(user);
        res.send(createdUser);
    } catch(error){
        res.status(400).send(`${error}`);
    }
}

const updateUser = async (req: Request, res: Response) => {
    const user: User = {
        password: req.body.password, 
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        id: req.body.id
    }
    const updatedUser = await store.update(user);
    return res.send(updatedUser);
}
const logout = async (req: Request, res: Response) => {
    //TODO: delete token
    res.send("loggedout");
}

const mount = (app: express.Application) => {
    app.get('/users',verifyToken, index); // done
    app.get('/users/:id', verifyToken, show); // done
    // app.post('/users/signup', verifyToken , create);
    app.post('/users/login', authenticate); // done
    // app.delete('/users/:id', logout) // not yet
    //! it's prefered to use /users/me instead of displaying id of the user
    app.delete('/users/:id', verifyToken, destroy); // done
    app.post('/users/signup', signUp); // done
    // app.post('/users/create', create);
    app.put('/users', verifyToken, updateUser); // done
}
export default mount;