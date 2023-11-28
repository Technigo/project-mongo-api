# Project Mongo API

This project provides a RESTful API for managing a book database. It includes functionalities to retrieve a collection of books, fetch details of a single book by ID, filter books based on the author and page count.

## The problem

### Selecting a Dataset:

I chose the "Books" dataset to build the API around. This involved creating a Mongoose model (BookModel) to represent the structure of the data.

### Setting Up the Environment:

I configured the development environment by initializing a Node.js project, setting up Express for handling HTTP requests, and connecting to MongoDB using Mongoose.

### Data Seeding:

I implemented a data seeding script to populate the MongoDB database with initial book data.

### Route Planning:

I planned the routes for the API based on the project requirements. This involved creating routes for documentation, retrieving all books, retrieving a single book by ID, filtering books by author and filtering boks by page count.

### Error Handling and Validation:

I implemented error handling to ensure that the API provides informative responses in case of errors.

### Testing:

I tested each endpoint using tools like Postman to simulate HTTP requests.

### Tools and Technologies Used:

#### Node.js and Express

Used for server-side development and handling HTTP requests.

#### MongoDB and Mongoose

Chosen as the database solution and ODM (Object Data Modeling) library, respectively.

#### express-list-endpoints

Used to generate API documentation.

#### Postman

Testing and validating API endpoints.

#### MongoDB Atlas

Cloud-based MongoDB hosting, providing a scalable and managed database solution.

#### Render

Deployment platform for hosting the Node.js application.

## View it live

View the deployed project here:
https://book-collection-mongo-api.onrender.com/
