import Client from '../config/db';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt';

export type User = {
    id?: number;
    firstname: string;
    lastname: string;
    password: string;
    email: string;
}

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows
        } catch (error) {
            throw new Error(`Unable to get users: ${error}`);
        }
    }
    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT * FROM users where id=($1)';
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to get user: ${error}`);
        }
    }
    async signUp(u: User): Promise<string>{
        //TODO: verification using Joi
        const {firstname, lastname, password, email} = u;
        const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
        const conn = await Client.connect();
        try { 
            const hash = bcrypt.hashSync(password + (process.env.PEPPER as string), parseInt(process.env.SALT_ROUNDS as string));
            console.log(hash);
            const result = await conn.query(sql, [firstname, lastname, email, hash]);
            const user = result.rows[0];
            conn.release();
            const userId: number = result.rows[0].id;
            const token = signToken(userId);
            return token;
        } catch (error) {
            throw new Error(`Unable to create user: ${u.firstname}, error: ${error}`);
        }
    }
    async delete(id: string): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'DELETE FROM users WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to delete User: ${error}`);
        }
    }
    async authenticate(email: string, passwordd: string): Promise<string | null> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT password, id FROM users WHERE email=($1)';
            const result = await conn.query(sql, [email]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                console.log(user);
                console.log("hit");
                const isValid = bcrypt.compareSync(passwordd + (process.env.PEPPER as string), user.password);
                console.log(isValid);
                if (isValid) {
                    console.log("hit 2");
                    const userId: number = result.rows[0].id;
                    const token = signToken(userId);
                    
                    return token;
                }
            }
            console.log("hit 3");
            return null;
        } catch (error) {
           throw new Error('error');
        }
    }
}