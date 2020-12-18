# Mongo API Project

This is an API using a database I've created.
I created the database using MongoDB and models of data using mongoose.

In this API you can find categories for the Golden Globes and see all nominations for each category.
You can also display all nominations if you'd like to.

## The project
This API has 5 routes.
A minimum of one endpoint return a **collection** of results (array of elements)
A minimum of one endpoint return a **single** result (single element).
The API makes use of Mongoose models to model data and use these models to fetch data from the database.
The API is [RESTful](https://www.smashingmagazine.com/2018/01/understanding-using-rest-api/)

One issue I had when doing this project was the issue of multiple categories with different id:s, even though the value of the category was the same.
To avoid this I created a set, which I late used in a forEach-loop to seed my database with categories.

## Tech
Javascript
Mongoose
MongoDB

## View it live
<a href='https://project-goldenglobes-mongodb.herokuapp.com'>Project Golden Globes Mongo </a>

## Author
<a href='https://github.com/emeliesv'>Emelie Svensson</a>