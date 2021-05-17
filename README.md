# Mongo API Project

Project week 18 Technigo bootcamp practice using database to store and retrive data, use that data to create RESTful API.
Main goal this week:
* Learn how to model data in Mongoose
* Learn how to fetch items from a Mongo database using Mongoose
* Learn how to seed large amounts of data to a database

Bonus learning:
* ENV VAR
* Secrets - to handle sensitive data

## My thoughts

This week i choose a different set of data to challange myself more and to feel comfortable with different sets of datatypes. 
A big challange was establishing relations between different data collections and understanding how to deploy connecting the database to MongoDB Atlas. Although it was a bit complicated the steps to do this where clear and i learned alot about how to use env variables.

I have also created alot of different endpoints, learning more about mongoose operators: .findByID(), .findOne(), find().
If i would have had more time i would have liked to challenge myself even more with different endpoints, more queries.
Also would have liked to dig deeper into aggregations.

## Tools
* Node.js
* Express
* MongoDB
* Mongoose
* JavaScript
* MongoDB Compass and Atlas
* Postman
* Heroku

## Endpoints
Link| Path | Description
| :--- | ---: | :---:
https://annas-book-data.herokuapp.com/  | "/"| Listing all endpoints
https://annas-book-data.herokuapp.com/books  | "/books"| Endpoint for all books and search title by query
https://annas-book-data.herokuapp.com/books/:bookId | "/books/:bookId"| Endpoint for single book by id path param
https://annas-book-data.herokuapp.com/books/:bookId/author  | "/books/:bookId/author" |  Endpoint for author by path param for book id
https://annas-book-data.herokuapp.com/authors/:authorID | "/authors/:authorID" | Endpoint for author by Id path param
https://annas-book-data.herokuapp.com/author/:authorID/books | "/author/:authorID/books" | Endpoint for all books by specific author


## View it live

https://annas-book-data.herokuapp.com/