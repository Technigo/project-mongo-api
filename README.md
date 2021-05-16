# Mongo API Project
In this project I am using a MongoDB database to store data, and a RESTful API that returns data in endpoints.

## The problem
The MongoDB database is modelled with Mongoose models to load the data from a Json to the database. The data consists of Netflix titles.
The API has these endpoints:

get('/titles') query to find a title, or returns all titles

get('/titles/:id') param for id

get('/titles/title/:title') param for title

get('/titles/country/:country') param for country, displays all titles from this country

## View it live

API: https://mongo-netflix.herokuapp.com/
