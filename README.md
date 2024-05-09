# Project Mongo API

This project is a simple RESTful API built with Express.js and MongoDB using Mongoose. It includes endpoints for fetching collections of movies, retrieving individual movies by specific criteria, and handling common error scenarios.

## The problem

During the development process, several challenges were encountered:

Auto-Increment Sequential IDs: The goal was to automatically assign sequential IDs to each document in the collection. Attempts to use mongoose-auto-increment resulted in an error indicating that the plugin was not initialized properly, leading to duplicate key errors and other issues. Given the difficulties with mongoose-auto-increment, the project focused on ensuring that the data had unique IDs without relying on auto-increment.

Date Formatting: The date did not look as in the original data.json and I try to format dates to a human-readable format, but finding a consistent approach proved challenging. The date formatting remained in the standard MongoDB format.

To address the challenges and create a functional API, the following tools and techniques were used:

Express.js: The framework used to build the RESTful API. It allowed for defining routes, middleware, and custom error handling.
Mongoose: The MongoDB ODM used to interact with the database, define schemas, and enforce constraints.
Postman: A tool used to test the API endpoints and ensure they behaved as expected.
Custom Error Handling: Implemented custom 404 error handling and other error responses to improve the robustness of the API.

## View it live

https://project-mongo-api-suco.onrender.com/
