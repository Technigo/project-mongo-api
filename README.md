# Project 18, Mongo API Project made during Technigo Bootcamp Spring 2020

This weeks project is to start using a database to store and retrieve data from and use that data to produce a RESTful API. This includes using mongoDB, Postman, Heruko and Compass to view my project. 

## The problem

For this project I used a database that was already given to us at the start of the assignment, it was a set of books containing some data about the author etc. After having the data I wanted to use I made a model of this database using Mongoose models, and used that to persist my data in the database.

Once the data was stored, using addBooksToDatabase data stored, I made appropriate RESTful endpoints to return the data and made the Mongoose Queries to find and return the correct data given the route and any filter params passed.

In the end I managed to retrieve the entire set of 499 objects from the bookdatabase, I managed to filter on title, number of pages and to find a specific book when using a specifik isbn number. 

## View it live

Link to my deployed project:
https://angie-project-mongo-api.herokuapp.com/
