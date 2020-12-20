# Mongo API Project

This objective of this project was to make a REST API that stores data in a Mongo DB database using Mogoose models.
In this project I used data on Netflix titles.

# Endpoints
-All Netflix-titles: '/netflix-titles'
-All titles from specific year: '/netflix-titles/year/:year'
-One title by ID: 'netflix-titles/id/:id'

Query-params:
-Find title by title-name. Example: '/netflix-titles?title=taxi'
-Find title(s) by specific director. Example: '/netflix-titles?director=scorsese'
-Find title(s) with specific actor. Example: '/netflix-titles?actor=foster'
-Find titles from country. Example: '/netflix-titles?country=germany'
-Find titles by type (TV or Movie etc). Example: '/netflix-titles?type=tv'

## Tech used
-Express
-Mongo DB
-Mongoose
-Mongo DB Compass
-Heroku
-Postman

## View it live


