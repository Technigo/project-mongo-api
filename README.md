# Mongo API Project
This week we started using a database to store and retrieve data from and use that data to produce a RESTful API. We also modeled our own database using Mongoose models, and persist our data in the database. I have used 1375 Netflix titles dataset. 

## What I have learned 🧠

- How to model data in Mongoose
- How to fetch items from a Mongo database using Mongoose
- How to seed large amounts of data to a database

## Endpoints
- GET '/': returns the list of all endpoints;
- GET '/movies': returns a list of all movie titles and query params for country, cast, show type, pagination for pages;
- GET '/movies/titles': returns only titles sorted alphabetically;
- GET '/movies/genres': returns all diffrent genres; 
- GET '/movies/years': returns all the diffrent years; 
- GET '/movies/years/latest': returns only movies from year 2018 until now;
- GET '/movies/:movieId': returns a particular movie;  

## View it live

Live 👉🏻   https://poggi-project-mongo.herokuapp.com/