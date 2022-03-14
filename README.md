a# Udacity-Storefront-api

E-Commerce api project for udacity fullstack web nanodegree 

## Project Structure
## API Endpoints

<table>
<tr> <td> Request </td> <td> URI </td><td> Parameter </td><td>Request body</td><td> Description </td> </tr> 
<tr>
<td> GET </td><td>/users</td><td>-</td><td> - </td> <td> show all the available users </td>
</tr>
<tr>
<td> GET </td><td>/users/:id</td><td>user id</td> <td> - </td> <td> get user by his id </td>
</tr>
<tr>
<td> DELETE </td><td>/users/:id</td><td>user id</td><td> - </td> <td> delete user by his id </td>
</tr>
<tr>
<td> PUT </td><td>/users/:id</td><td>user id</td>
<td>

```json
{
    "firstname": "yousef",
    "lastname": "meska",
    "password": "0000",
    "email": "test@test.com",    
}
```
</td> 
<td> delete user by his id </td>
</tr>
<tr>
<td> POST </td><td>/users/signup</td><td>-</td> 
<td> 

```json
{
    "firstname": "yousef",
    "lastname": "meska",
    "password": "0000",
    "email": "test@test.com",  
}
```
</td> 
<td> create/signup user</td>
</tr>

<tr>
<td> POST </td><td>/users/login</td><td></td> 
<td>

```json
{
    "email": "test@test.com",
    "password": "0000"
}
```
 </td> <td>login/authenticate user</td>
</tr>

<tr>
<td> GET </td><td>/products</td><td>-</td> <td> - </td> <td>Get all the available products</td>
</tr>

<tr>
<td> GET </td><td>/products/:id</td><td>product id</td> <td> - </td> <td> get product by it's id </td>
</tr>

<tr>
<td> DELETE </td><td>/products/:id</td><td>product id</td> <td> - </td> <td> delete product by it's id</td>
</tr>

<tr>
<td> POST </td><td>/products/create</td><td>-</td> 
<td>

```json
{
    "name": "product_name",
    "price": 13,
    "category": "product_category"
}
```
</td> <td> create a new product</td>
</tr>

<tr>
<td> PUT </td><td>/products</td><td>-</td> 
<td>

```json
{
    "id": 1,
    "name": "another_name",
    "price": 24,
    "category": "another_category"
}
```
</td> <td> update product by it's id</td>
</tr>

<tr>
<td> GET </td><td>/products/:category</td><td>category</td> <td> - </td> <td> get products by category name</td>
</tr>

<tr>
<td> GET </td><td>/products</td><td>-</td> <td> - </td> <td>get all available orders</td>
</tr>

<tr>
<td> GET </td><td>/orders/:id</td><td>order id</td> <td> - </td> <td> get order by it's id</td>
</tr>

<tr>
<td> DELETE </td><td>/order/:id</td><td>order id</td> <td> - </td> <td> delete order by it's id</td>
</tr>

<tr>
<td> GET </td><td>/orders/users/current/:user_id</td><td>user id</td> <td> - </td> <td> get the current order for user by user id</td>
</tr>

<tr>
<td> GET </td><td>/orders/users/open/:user_id</td><td>user id</td> <td> - </td> <td>get open orders for user by user is</td>
</tr>

<tr>
<td>GET </td><td>/orders/users/closed/:user_id</td><td>user id</td><td>-</td><td>get closed orders for user by user id</td>
</tr>

<tr>
<td>GET </td><td>/orders/users/:user_id</td><td>user id</td><td>-</td><td>get all orders for the user by it's it</td>
</tr>

<tr>
<td>POST</td><td>/orders/create</td><td>-</td><td>

```json
{
    "user_id": 1,
    "status": "open",
}
```
</td>
<td>create order for the user [user_id]</td>
</tr>
<tr>
<td>PUT</td><td>/order/:id?status=</td><td>order id, status as query string</td><td>-</td><td>update order status for the user</td>
</tr>
<tr>

<td>GET</td><td>/order-products/:orderId/products</td>order id </td> <td> - </td> <td>-</td><td>Get all products on an order by order it</td>
</tr>

<tr>
<td>PUT</td><td>/orders-products/:orderId</td><td>order id</td> 
<td>


```json
{
    
    "product_id": 1,
    "order_id": 2,
    "quantity": 12
}
```
</td>
<td> update an order </td>
</tr>

<>
<td>DELETE </td><td>/order-products/:orderId/:productId</td><td>orderId, productId</td><td>-</td><td>DELETE product from specific order</td>

</tr>
</table>


## Installing
Install the project dependencies
```bash
npm install
```

## Setup and Connect to database

- creating the database
```bash
CREATE USER shop_user WITH PASSWORD 'password123';
CREATE DATABASE shop;
CREATE DATABASE shop_test;
\c shop;
GRANT ALL PRIVILEGES ON DATABASE shop To shop_user;
\c shop_test 
GRANT ALL PRIVILEGES ON DATABASE shop_test To shop_user;
```

- setting enviroment variables
```bash
touch .env
nano .env

## place the enviroment variables below inside the .env file
# .env
APP_PORT=3000
POSTGRES_HOST=localhost
POSTGRES_USER=shop_user
POSTGRES_DB=shop
POSTGRES_PASSWORD=password123
POSTGRES_TEST_DB=shop_test
ENV=test
BCRYPT_PASS=thisissupersecretpassword
SALT_ROUNDS=10
PEPPER=password
JWT_SECRET_KEY=thisissupersecretpassword
```


- port of the posgres database server
`5432`
- port of the backend: 
the server runs <a href="http://localhost:3000">localhost</a>
- package installation instructions
#### Running Or Dropping Migration

**Running**
- testing db
```bash
db-migrate up -e test
```
- development db
```bash
db-migrate up -e dev
```
or simply run
```bash
npm run migrate
```

**Rollingback**
```bash
db-migrate down
```

## Running application
- to run on compiled files
```bash
npm run dev
```
- to run on typescript files
```bash
npm run start:dev
```
## Running Tests

To run tests, you need only two steps
1. Export ENV to test
```bash
export ENV=test
```
2. Run testing command, which will build the project and run the tests, this step is so important because `jasmine` tests the compiled js code
```bash
npm run build-test
```

or simple run 
```bash
npm run test
```
