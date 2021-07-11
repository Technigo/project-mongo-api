# Mongo API Project
In this project I used a database to store and retrieve data from and use that data to produce a RESTful API.

## Tasks
- API should have two or more endpoints;
- A minimum of one endpoint to return a **collection** of results (array of elements);
- A minimum of one endpoint to return a **single** result (single element);
- API should make use of Mongoose models to model the data and use these models to fetch data from the database.
- API should be RESTful.

## Stretch goals
- use mongoose to filter the data
- implement 'pages' using .skip() and .limit()
- create endpoind using mongoose aggregate function

## Tech
- MongoDB
- mongoose
- REST API
- Express


## Endpoints

- GET '/': returns the list of all endpoints;
- GET '/categories': returns a list of all; 
- GET '/categories/:categoryId/nominees': returns the list of nominees in this category;
- GET '/nominees': returns the list of all Golden Globe nominees;
- GET '/nominees/:id': returns information about a nominee;
- GET '/winners': returns the list of all winners;
- GET '/winners/:id': returns the information about the winner;
- GET '/winners/:id/category': returns the category of nomination of particular winner

## View it live

Heroku: https://project-mongo-klimenko.herokuapp.com/

