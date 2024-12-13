# Project Mongo API

Replace this readme with your own information about your project.

Start by briefly describing the assignment in a sentence or two. Keep it short and to the point.

## Requirements:  
  1. The API should have at least 3 routes.  
    This API has the following routes:  
    - /: Returns documentation of the API using express-list-endpoints.[Express List Endpoints](https://www.npmjs.com/package/express-list-endpoints). 
  2. Mongoose Query Objects used in this project:  
    - Model.findOne() 
    

## Dependency Installation & Startup Development Server
This project uses npm (Node Package Manager) and Express.js to manage dependencies and run the development server.  It uses MongoDB as the database and the Mongoose library for database interaction. 

Follow these steps to get started:  
  1. Install Project Dependencies  
  Run the following commands to install necessary packages and set up the development environment:  
    ```bash
    npm install
    ```  
  2. Run in development mode: Use the following command during testing: 
    ```bash
    npm run dev
    ``` 
  3. When preparing for production, build the project using:
     ```bash
    npm run build
    ``` 
  4. If Express.js is not already installed, initialize your project and install it:  
    ```bash
    npm init -y
    npm install express
    ```  
  5. Start your server   
  Launch the server:
    ```bash
    npm start
    ```  
  6. The package used to generate a list of all available API endpoints automatically (shown on the endpoint /). Install it with:  
  ```bash
  npm install express-list-endpoints
  ``` 
  7. To start your local MongoDB, run:  
  ```bash
  mongod
  ```
  8. Seed the database. To reset and seed the database with initial data, run:    
  ```bash
  RESET_DB=true npm start
  ```
## .env files 

```bash
npm install dotenv
```

## Useful resources  
- [Mongoose Query objects](https://mongoosejs.com/docs/queries.html)


## The problem  
1. Deploying to Render    


## View it live

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.
