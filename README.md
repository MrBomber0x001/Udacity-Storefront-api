a# Udacity-Storefront-api

E-Commerce api project for udacity fullstack web nanodegree 

## Project Structure
## API Endpoints

Head over to [REQUIREMENTS](./REQUIREMENTS.md)
## Installing
Install the project dependencies
```bash
npm install
```

## Setup and Connect to database

1. **creating user**
 
```sh
CREATE USER shop_user WITH PASSWORD 'password123';
```
2. **create both development and testing db**
```sh
CREATE DATABASE shop;
CREATE DATABASE shop_test;
```
3. **grant all privileges on both databases**
```sh
\c shop;
GRANT ALL PRIVILEGES ON DATABASE shop To shop_user;
\c shop_test 
GRANT ALL PRIVILEGES ON DATABASE shop_test To shop_user;
```

- setting enviroment variables
```sh
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
```sh
db-migrate up -e test
```
- development db
```sh
db-migrate up -e dev
```
or simply run
```sh
npm run migrate
```

**Rollingback**
```sh
db-migrate down
```

## Running application
- to run on compiled files
```sh
npm run dev
```
- to run on typescript files
```sh
npm run start:dev
```
## Running Tests

To run tests, you need only two steps
1. Export ENV to test
```sh
export ENV=test
```
2. Run testing command, which will build the project and run the tests, this step is so important because `jasmine` tests the compiled js code
```sh
npm run build-test
```

or simple run 
```sh
npm run test
```
