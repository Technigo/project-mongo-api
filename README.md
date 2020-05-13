# Mongo API Project
This project was part of the Technigo programming bootcamp, it is a continuation of the Express API Project and is a Netflix API built in Node using Express. Instead of using data straight from netflix-titles.json, the API uses MongoDB and Mongoose to store the data.

The following endpoints are available:
Root: /
Shows: /books
Show by id: /shows/:show_id

Queries can be used to limit the /shows endpoint and search shows by title, e.g. /shows?title=What's Eating Gilbert Grape or /shows?title=gilbert

## The problem
The task was to use a database to store and retreive data used to produce a RESTful API. Using Mongoose model functions .find() or .findOne(), either a list of shows or a single show is returned.

## Learning objectives
- How to model data in Mongoose
- How to fetch items from a Mongo database using Mongoose
- How to seed large amounts of data to a database

## Technologies used
- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript ES6

## View it live
https://anna-project-mongo-api.herokuapp.com/ 
