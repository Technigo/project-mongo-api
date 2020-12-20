



In this project I've created an API with RESTful endpoints using MongoDB as database to store and retrieve data.

## Learning objectives
* How to model data in Mongoose
* How to fetch items from a Mongo database using Mongoose
* How to seed large amounts of data to a database

## The problem
I used json data including 499 books and created different endpoints and query parameters. I used the tmothed findAll() to get all the book from the database and thje method finOne() to get books by one author or a book with a specific title. To handle error I  added middlewaress to the database and I also added error handlers for all GET-requests.

## Endpoints:
Authors: books/authors
Author by id: /authors/:id (new)
Books by specific author: /authors/:id/books (new)
Root: /
Books: /books
Book by id: /books/:id
Book by title: /titles/:title
Sort book by rating and choose nr of books to dislplay: /toplist/:nr

## Tech:
* MongoDB
* Mongoose
* Node.js
* Express


## View it live

https://bookapi-by-sara.herokuapp.com/
