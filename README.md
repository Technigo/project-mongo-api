# Project Mongo API

This is an API built using Node.js, Express, and MongoDB, designed to provide information about Harry Potter characters. The API allows users to retrieve details about characters, filter them by various attributes, and query individual characters based on their unique IDs or names.

## The problem & process

- I began by importing my JSON file containing Harry Potter characters and defining a Mongoose model. Next, I created an environment function to seed the database. Since I had previously created routes for a similar API using plain JavaScript, I reused those routes and endpoints but adapted them to work with Mongoose.

- I wanted to allow users to filter characters by role, house, and year using query parameters, enabling them to filter by multiple criteria at once. To achieve this, I created a dynamic query object using conditional statements. With Mongoose's find method, the query object enabled filtering on individual attributes or a combination of them.

- To make the filtering case-insensitive, I used regular expressions with the i flag, allowing users to enter queries in both lowercase and uppercase letters.

- Initially, I used the id from the JSON file to filter characters by their unique identifier. However, since MongoDB automatically generates an ObjectId, I decided to remove the custom id field from the JSON file. Instead, I used new mongoose.Types.ObjectId to generate new IDs and implemented filtering based on the default ObjectId. 

## Problem with deployment
I successfully connected the API to MongoDB Atlas, and the data is now visible there. To secure the connection, the Atlas URL  along with the username and password is stored in a .env file.

- However, when deploying the API on Render, only the root route (/) works, while the other routes fail to display. This suggests that Render cannot establish a connection to the MongoDB Atlas URL provided in the .env file. Despite attempting several solutions, the issue remains unresolved. 

## View it live

https://project-mongo-api-8bgk.onrender.com/

