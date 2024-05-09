# Project Mongo API

This project involves creating a RESTful API using Express.js and MongoDB to manage a collection of dogs. It allows users to perform CRUD operations on dog data, including filtering dogs based on attributes like breed, age, weight, and color.

## The problem

To solve this problem, I utilized Express.js to create the API endpoints and mongoose to interact with the MongoDB database. The project follows a structured approach where each endpoint is defined to handle specific CRUD operations on the dog collection. Middleware like cors and express.json is used for enabling CORS and parsing JSON request bodies.

If I had more time, I would focus on implementing authentication and authorization to secure the API endpoints. Additionally, I would enhance error handling and validation to provide better feedback to users.

## Endpoints

-GET /dogs: Fetch all dogs. Queries supported: breed, age, weight_kg, color.
-GET /dogs/:id: Fetch a specific dog by its ID.
-POST /dogs: Create a new dog.
-PUT /dogs/:id: Update a dog's age and weight by its ID.

## Supported Queries

-breed: Filter dogs by breed.
-age: Filter dogs by age.
-weight_kg: Filter dogs by weight in kilograms.
-color: Filter dogs by color.

## View it live

The API is deployed on Render. You can access it [here](https://project-mongo-api-ff4z.onrender.com).
