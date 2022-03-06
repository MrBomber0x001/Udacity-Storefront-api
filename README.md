# Udacity-Storefront-api

E-Commerce api project for udacity fullstack nanodegree 

## API Endpoints


## Setup and Connect to database

- ports of the database,

- port of the backend

- package installation instructions

## Endpoints

- correct RESTful routes for the required endpoints.
- each RESTful route should be associated with the correct HTTP verb.

add product to the order
app.post('/orders/:id/products', addProduct);

## Database Schema
![](./images/db_schema.png)

#### avaiable routes
-> Orders Routes
GET orders/current/:userId 
GET orders/open/:userId 
GET orders/closed/:userId 
DEL orders/:id 
DEL orders/:id 
POST orders/create 
PUT orders/:id -> update status

-> Products Routes
GET products/ 
GET products/:id 
GET products/cat/:category
POST products/create
DEL product/:id

-> User Routes
GET users/ 
GET users/:id 
POST users/signup 
DEL users/:id 
#### setup and connecting to database

```bash
CREATE USER storefront WITH PASSWORD 'password123';
CREATE DATABASE storefront;
CREATE DATABASE storefront_test;
\c storefront;
GRANT ALL PRIVILEGES ON DATABASE storefront To storefront_user;
\c storefront_test 
GRANT ALL PRIVILEGES ON DATABASE storefront_test To storefront_user;
```

#### Running migration
```bash
db-migrate up
```
Rolling back migrations
```bash
db-migrate down
```