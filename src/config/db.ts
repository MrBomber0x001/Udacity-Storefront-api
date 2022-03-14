import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const {POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, ENV,POSTGRES_TEST_DB} = process.env;
console.log(POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, ENV,POSTGRES_TEST_DB);
export let Client: Pool;
if(ENV === 'dev'){
    Client = new Pool({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB
    });
} else if(ENV === 'test'){
    Client = new Pool({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_TEST_DB,
    })
}
