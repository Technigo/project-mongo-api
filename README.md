# Mongo API Project

Continuing working on the API built in the Express API Project, this is a book API built in Node using Express. Instead of using a the data straight from books.json, the API uses MongoDB and Mongoose to store the data.

The following endpoints are available:
- Root: `/`
- Books: `/books`
- Book by ISBN13: `/books/:isbn13`

Queries can be used to sort or limit the `/books` endpoint:
- Sort by rating, e.g. `/books?sort=sort_asc`
- Select page, e.g. `/books?page=2`
- Search books by author, e.g. `/books?author=rowling`
- Search books by title, e.g. `/books?title=harry`

## The problem

The task was to use a database to store and retreive data used to produce a RESTful API. Using Mongoose model functions `.find()` or .`findOne()`, either a list of books or single book is returned as JSON. For the `/books` endpoint, model functions `.limit()` and `.skip()` are used for pagination and `.sort()` is used to sort the books using a query.

## Learning objectives

- How to model data in Mongoose
- How to fetch items from a Mongo database using Mongoose
- How to seed large amounts of data to a database

## Tech

- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript ES6

## View it live

https://fridamaria-mongo-api.herokuapp.com/
