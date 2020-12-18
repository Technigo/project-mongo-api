# Mongo API Project

In this week's project it was time to level-up my APIs and start using a database to store and retrieve data from and use that data to produce a RESTful API.

## What I have learnt

* How to model data in Mongoose
* How to fetch items from a Mongo database using Mongoose
* How to seed large amounts of data to a database

## The process and structure

I decided to re-use last weeks setup of my Book API and replicate those endpoints and now fetch items from my Mongo database using Mongoose.

Avaialble endpoints:

* Root: /
* Books: /books
* Books top 20 rated: /books/top-20-rated 
* Book by id: /books/:id
* Authors: /authors
* Author by id: /authors/:id (new)
* Books by specific author: /authors/:id/books (new)


### Core Tech

* Javascript
* Express
* Mongo DB
* Moongoose
* Heroku
* Postman
* MongoDB Compass

## View it live

[Book API with Mongo DB by Ylva at Heroku](https://book-api-mongodb-by-ylva.herokuapp.com/)