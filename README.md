# Project Mongo API

This project builds on [Project Express API](https://github.com/joheri1/project-express-api) to create a RESTful API, and using MongoDB as a database. Mongoose is used to store, retrieve, and filter data more efficiently. The API leverages Mongoose methods instead of plain JavaScript for operations like filtering.

## Requirements:  
  1. The API should have at least 3 routes.  
    This API has the following routes:  
    - "/": Returns documentation of the API using express-list-endpoints.[Express List Endpoints](https://www.npmjs.com/package/express-list-endpoints).  
    - "/elves": endpoint to return a collection of results (all elves or filter using query params  e.g., ?title=backend dasher&top_twelves=true").  
    - "/elves/:id": Endpoint to return a single result (Get a specific elf by ID).  
    - "/test": Test endpoint. 
  2. The API should use Mongoose model. 
   This API uses Mongoose models to model the data and use these models to fetch data from the database.  
   ```bash
    const Elf = mongoose.model('Elf', {
    "elfID": Number,
    "title": String,
    "name": String,
    "language": [String],
    "reviews_count": Number
    ``` 
  3. The API should be RESTful
    This API's RESTful examples: 
    - The /elves endpoint acts as a flexible entry point by the use of query parameters. 
    - Path parameters (/elves/:id) are used only for identifying unique resources.  
    - API returns appropriate HTTP status codes:  
        200 → Success (e.g., when data is found).  
        404 → Not Found (e.g., when an elf with the given ID does not exist).  
        500 → Internal Server Error (e.g., database issues).  
    - Uses GET for fetching data.  
   4. Follow the guidelines on how to write clean code.
    This API's examples of clean code: 
    - Variable names are clear and descriptive (e.g. request, response, title).

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
  9. Delete dist folder to update code  
  ```bash
  rm -rf dist
  ````

## .env files 

```bash
npm install dotenv
```

## Useful resources  
- [Mongoose Query objects](https://mongoosejs.com/docs/queries.html)
- [Use Regular Expression for case insensitivity](https://stackoverflow.com/questions/52073031/case-insensitive-key-name-match-mongoose)


## The problem  
### Deploying to Render  
When deploying to Render, I encountered some issues:  
- The first issue was related to the MongoDB user I had created. The deployment failed due to an authentication error.
Solution: I deleted the user and created a new one.  

- The second issue involved my dist folder not updating with the latest code. Despite rebuilding the project, the files in dist caused issues during deployment.
Solution: I used the following command to remove the folder everytime I wanted to deploy to Render:  

```bash
rm -rf dist
```  
Then, I rebuilt the project using:
```bash
npm run build
```  
Then, I manually deployed the latest commit on Render.  

## If I had more time  
I started working on creating new components for the seeding logic, but it isn't completed yet. If I had more time, I would focus on finishing the seeding component and adding separate files for the Mongoose model and the Routes to make the application more modular and maintainable.

## View it live

[Project Mongo API](https://project-mongo-api-x8p0.onrender.com)
