import jwt from 'jsonwebtoken';
import{NextFunction, Request, Response} from 'express';
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try{
    const authToken: string | undefined = req.headers['authorization'];
    const token: string = authToken ? authToken.split(' ')[1]: '';
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    next();
    } catch(error){
        return res.status(401);
    } 
}
export const signToken = (userId: number): string => {
    return jwt.sign(userId.toString(), process.env.JWT_SECRET_KEY as string);
} 