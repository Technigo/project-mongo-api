# Project Mongo API

This project is a RESTful API built using MongoDB with Mongoose. The API serves data from a music dataset, providing endpoints to retrieve information about all tracks or individual tracks by ID.

## The problem

I approached the problem by planning the structure of the data and required endpoints and designed a Mongoose schema to map the dataset to the MongoDB database. The endpoints can retrieve a list of all tracks or retrieve details of a single track by its unique ID. The API also supports advanced query options like filtering and sorting. Tracks can be filtered by artist, genre, bpm, and popularity. Tracks can also be sorted by specified fields in ascending or descending order.

I used Node.js and Express for building the API and MongoDB Atlas as the cloud-hosted database. I used Mongose for modeling and interacting with the database and Render for deployment.

If I had more time I would enhance the model and add additional query parameters to allow users to search for tracks based on attributes like danceability and energy.

## View it live

https://project-mongo-api-ww5r.onrender.com/
