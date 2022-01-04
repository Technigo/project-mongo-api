# Mongo API Project

A project that consists of a Mongo-backed API. The goal for this project was to learn about MongoDB, using a database to store and retrieve data and to produce a RESTful API.

# API documentation
GET "/" - main endpoint
GET "/endpoints" - lists all the endpoints
GET "/books" - list all the books
GET "/books/:id" - shows a specific book based on id
GET "/books/title/:title" - shows a specific book based on title

## The problem

I started by seeding the database from the json file. After storing the data I created the RESTful endpoints written below using Mongoose queries. I also made sure to provide error messages from the endpoints.

## Tech
- MongoDB
- Mongoose
- Node.js
- Express
## View it live

https://project-mongo-api-books.herokuapp.com/


