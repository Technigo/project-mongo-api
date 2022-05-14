# Astronauts Mongo API

I built a RESTful API using Node, Express, and MongoDB. Creating endpoints for reading data about Astronauts. This 
project is built on top of a RESTful API I built using only Node and Express to read the same Astronauts data.

## The project

The first thing I did was configured the mongoDB Database and created an Astronauts database. Then I created 
Routes for my three endpoints (astronauts, missions, and years). Next I created two Models to define my database 
structures. 

Then use the Model.find method to fetch all the data from the database and return it back in JSON format. Lastly, 
I implemented error handling and pagination using the .skip() and .limit() methods along with find().

## Hosted

This project is hosted on Heroku: https://astronauts-mongo.herokuapp.com/
