import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const {POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, ENV} = process.env;
console.log(POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_USER);
const client = new Pool({
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB
});

export default client;