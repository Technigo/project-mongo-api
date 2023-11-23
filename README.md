# Project Mongo API

This project is a MongoDB API that serves bird-related information, including bird families and individual bird species. The API is built using Express.js, MongoDB, and Mongoose.

## The problem

The goal of this project was to create a RESTful API for bird data, allowing users to retrieve information about bird families, individual bird species, and filter birds based on habitat and diet. The project involved setting up a MongoDB database on Atlas, defining Mongoose models for bird families and species, and implementing various endpoints to handle different queries.

Approach and Technologies Used
Folder Structure:

The project follows a modular structure with separate folders for models, routes, and the main server file.
models/: Contains Mongoose models for BirdFamily and Bird.
routes/: Includes separate route files for bird families and individual bird species.

Database Connection:
The project connects to a MongoDB database hosted on MongoDB Atlas. The connection string is stored in the .env file.

Express.js:
The API is built using Express.js to handle routing and HTTP requests.

Mongoose:
Mongoose is used as an ODM (Object Data Modeling) library to interact with the MongoDB database.

## View it live
he API is deployed and can be accessed at: https://bird-test-0s48.onrender.com/
