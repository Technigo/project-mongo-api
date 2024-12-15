# Project Mongo API
## Introduction
Welcome to the Project Mongo API, a RESTful API built with Node.js and MongoDB. This project serves as a backend solution for managing users and trips, including features such as CRUD operations, data validation, and database seeding.

## Highlights
- Fully RESTful API for Users and Trips.
- MongoDB integration with Mongoose ORM.
- Robust validation middleware using express-validator.
- Centralized error handling for consistent responses.
- Database seeding for easy setup with sample data.
- Supports both local development and deployment to MongoDB Atlas.

## Key Technologies
- Node.js: Backend runtime.
- Express.js: Web framework for building the API.
- MongoDB: NoSQL database for storing users and trips.
- Mongoose: Elegant MongoDB object modeling for Node.js.
- dotenv: Environment variable management.
- express-validator: Middleware for request validation.
- Babel: Transpilation for modern JavaScript.
- Nodemon: Development tool for auto-reloading the server.

## Future Enhancements
- Add authentication and authorization.
- Implement advanced filtering and sorting for trips.
- Add unit and integration tests.

## Available Endpoints
Method	  Endpoint	        Description
GET	      /api/users	      Get all users
POST	    /api/users	      Create a new user
PUT	      /api/users/:id	  Update an existing user
GET	      /api/trips	      Get all trips
POST    	/api/trips	      Create a new trip
PUT	      /api/trips/:id	  Update an existing trip

## View it live

https://project-mongo-api-df42.onrender.com/