# Project Mongo API

This project involves creating a RESTful API using Node.js, Express, and MongoDB with Mongoose models to handle data storage and retrieval.

## The problem

This assignment focuses on building a robust API that interacts with a MongoDB database using Mongoose models. It involves seeding the database with provided or self-generated data and implementing various endpoints to fetch and manipulate this data.

## Overview

### Install Dependencies:
Run npm install to install all the required dependencies listed in your package.json file.

### Set Environment Variables:
Ensure you have a .env file containing the necessary environment variables, such as MONGO_URL for connecting to your MongoDB database. This file should not be committed to version control for security reasons.

### Start the Server:
#### For development (with automatic restart on file changes):
Use npm run dev to start the server using nodemon, which watches for changes in files and automatically restarts the server.

#### For production:
Use npm start to start the server in production mode.

### Access the API Endpoints:
Once the server is running, you can access the defined API endpoints using tools like Postman or by sending HTTP requests from your browser or any other API testing tool.

### Technologies used
- Node.js
- Express.js
- MongoDB
- Mongoose

### Routes

#### Endpoint 1: "/"
- **Description:** Provides API documentation using Express List Endpoints.
- **HTTP Method:** GET
- **Functionality:** Returns details about available endpoints and their functionalities.

#### Endpoint 2: "/movies"
- **Description:** Get all movies.
- **HTTP Method:** GET
- **Functionality:** Retrieves all movies available in the database.

#### Endpoint 3: "/movies/:id"
- **Description:** Get a movie by its ID.
- **HTTP Method:** GET
- **Functionality:** Retrieves a movie based on the provided ID.

#### Endpoint 4: "/movies/type/:type"
- **Description:** Get movies by type (TV Show or Movie).
- **HTTP Method:** GET
- **Functionality:** Retrieves movies based on the specified type.

#### Endpoint 5: "/movies/year/:year"
- **Description:** Get movies by release year.
- **HTTP Method:** GET
- **Functionality:** Retrieves movies released in the specified year.

#### Endpoint 6: "/movies/rating/:rating"
- **Description:** Get movies by rating.
- **HTTP Method:** GET
- **Functionality:** Retrieves movies based on the specified rating.

#### Endpoint 7: "/movies/page/:page"
- **Description:** Get paginated movies.
- **HTTP Method:** GET
- **Functionality:** Retrieves paginated movies based on the specified page number.

## View it live

See it live on render: https://project-mongo-movies.onrender.com

