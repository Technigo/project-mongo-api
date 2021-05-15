# Mongo API Project 🐙

I've built a RESTful API using a database to store and retrieve data. 

I used MongoDB for the database, mongoose for the modelling of data and Express.js (Node.js framework).


## The problem

The main task was to build a RESTful API and to use a database to store and retrieve data.

I started with setting up the database using MongoDB and built a model for the data that I chose (books data) using mongoose. After that I set up an async function to seed the database using the aforementioned mongoose model with an if statement around it to ensure that the database is only being reseeded when I want it to. With the database in place I began thinking about what kind of endpoints I would like to have for the data. I then started to create the endpoints home, all books, books by top rating (4 or higher), short read and id. I also implemented filters via query parameters to filter, via mongoose, the data returned from endpoints which then return an array of data.

I've also implemented error handling throughout the project. For instance, when searching for a book by id, I've set up an if statement to handle when the specific id doesn't exist and return some useful data in the response instead. I've also implemented try and catch blocks.

I chose to use the npm package express-list-endpoints to list the endpoints in the home endpoint. I continuously tested my API using Postman and checked out my database using MongoDB Compass. 

If I had more time, I would implement a frontend to by API where I display the documentation for my API. I would also like to implement pages to return only a selection of results from the array and to use mongoose's aggregate function.


## View it live

Link to my deployed API: https://project-mongo-api-isabellam5.herokuapp.com/
