import {Client} from '../config/db';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt';

export type User = {
    id?: number;
    firstname: string;
    username?: string;
    lastname: string;
    password?: string;
    email: string;
    //token? :string
}
export type UserToken = {
    user: User,
    token: string
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
    async show(id: number): Promise<User> {
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
    async create (u: User): Promise<User>{
        try {
            const {firstname, lastname, email, password} = u;
            const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
            const conn = await Client.connect();
            const result = await conn.query(sql , [firstname, lastname, email, password]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot create user :${u.firstname}: ${error}`);
        }
    }
    async signUp(u: User): Promise<UserToken>{
        //TODO: verification using Joi: verification is done on the req itself
        const {firstname, lastname, password, email} = u;
        const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
        const conn = await Client.connect();
        try {
            // if the user already exist? 
            const hash = bcrypt.hashSync(password + (process.env.PEPPER as string), parseInt(process.env.SALT_ROUNDS as string));
            const result = await conn.query(sql, [firstname, lastname, email, hash]);
            const user = result.rows[0];
            conn.release();
            const userId: number = user.id;
            const token = signToken(userId);
            return {token, user};
        } catch (error) {
            throw new Error(`Unable to create user: ${u.firstname}, error: ${error}`);
        }
    }
    async delete(id: number): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to delete User ${id}: ${error}`);
        }
    }
    async update (u: User): Promise<User>{
        try {
            const {firstname, lastname, password, email, id} = u;
            const sql = 'UPDATE users SET firstname=$1, lastname=$2, email=$3, password=$4 WHERE id=$5 RETURNING *';
            const hashedPassword = bcrypt.hashSync(password + (process.env.PEPPER as string), parseInt(process.env.SALT_ROUNDS as string));            
            const conn = await Client.connect();
            const result = await conn.query(sql, [firstname, lastname, email, hashedPassword, id]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Unable to update user : ${error}`);
        }
    }
    async authenticate(email: string, passwordd: string): Promise<UserToken | null> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT password, id FROM users WHERE email=($1)';
            const result = await conn.query(sql, [email]);
            if (result.rows.length > 0) {
                let user = result.rows[0];
           
                const isValid = bcrypt.compareSync(passwordd + (process.env.PEPPER as string), user.password);
                if (isValid) {
                    const userId: number = result.rows[0].id;
                    const token = signToken(userId);
                    user = await conn.query("SELECT * FROM users where id=($1)", [userId]);
                    conn.release();
                    return {user: user.rows[0], token};
                }
            }
            conn.release();
            return null;
        } catch (error) {
           throw new Error('error');
        }
    }
}