# Mongo API Project

In this project I created an API with RESTful endpoints using MongoDB as database to store and retrieve data. 

## The problem

I used json data including 499 books and created different endpoints and query parameters. I also added the express-list-endpoints package to summarize the existing endpoints. I used the mongoose package to making seed data and to create queries. 

I created two models, one for the books and one for the authors. To get an array of unique authors I had to create a new array for the authors. The authors are connected to the books they have written but since they change id for each reload of the data I did not create any endpoints including searching on id per author. 

I added middlewares to handle connection errors to the database and I did also added error handlers for all GET-requests. 

With the mongoose method `find()` I retrieve one collection of all books and one collection of all authors. With the method `findOne()` I retrieve book with specific bookID or isbn. 

In the end I added pagination to the backend data by using the mongoose methods `.skip()` and `.limit()`. That was really fun to learn how to use. Right now the first page is page=0, I hope I will have time to change this further on.

Front End repo: https://github.com/Gabbi-89/frontend-book-api (Not finished)

## Learning Objectives

- How to model data in Mongoose

- How the fetch items from a Mongo database using Mongoose

- How to seed large amounts of data to a database

## Tech

- Node

- API's

- MongoDB

- Heroku

## View it live

Link to the deployed API: https://books-mongo-api.herokuapp.com/
