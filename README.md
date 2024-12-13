# Project Mongo API

This project focuses on creating a RESTful API using Express and Mongoose to interact with a MongoDB database. The API allows users to perform CRUD operations on a dataset, making it accessible via multiple endpoints. The database is hosted on MongoDB Atlas and the API is deployed on Render for public accessibility.

## The problem

The task was to build an API that provides structured data responses from a database, ensuring the following:

- Database modeling with Mongoose schemas and models.
- Seeding the database using a function to load JSON data into MongoDB Atlas.
- RESTful endpoints for retrieving collections (GET /books) and single items (GET /books/ :id) and for adding new entries (POST /books).
- Deployment on Render and connected it to a MongoDB Atlas database for scalability and accessibility.

## Tools and Technologies

- Backend: Node.js, Express.js
- Database: MongoDB Atlas, Mongoose
- Deployment: Render
- Testing: Postman
- Additional Libraries: dotenv, cors, body-parser, express-list-endpoints

## View it live

https://project-mongo-api-pbzi.onrender.com/
https://project-mongo-api-pbzi.onrender.com/books/
https://project-mongo-api-pbzi.onrender.com/books/675b270be387aacf002d49f9
