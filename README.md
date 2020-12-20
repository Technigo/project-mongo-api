



In this project I've created an API with RESTful endpoints using MongoDB as database to store and retrieve data.

## Learning objectives
* How to model data in Mongoose
* How to fetch items from a Mongo database using Mongoose
* How to seed large amounts of data to a database

## The problem
I used json data including 499 books and created different endpoints and query parameters. I used the tmothed findAll() to get all the book from the database and thje method finOne() to get books by one author or a book with a specific title. To handle error I  added middlewaress to the database and I also added error handlers for all GET-requests.

## Endpoints:
* Root: /
* All books: /books
* Books by specific authors: /authors/:author
* Books by title: /titles/:title
* Book by id: /books/:id

## Tech:
* MongoDB
* Mongoose
* Node.js
* Express


## View it live

https://bookapi-by-sara.herokuapp.com/
