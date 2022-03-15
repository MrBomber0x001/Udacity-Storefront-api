/* Replace with your SQL commands */
create table users(
    id serial PRIMARY key,
    email VARCHAR(100) UNIQUE not null,
    firstname VARCHAR(50) not null,
    lastname VARCHAR(50) not null,
    password text not null
);