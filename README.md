# Mongo API Project

This project is build with MongoDB where I fetched data from Mongo database using mongoose models.

## Solution

To do this project I first created my own data and converted it to JSON using https://www.csvjson.com/. The data I created consist of restaurants in Stockholm that has changing rooms for babys. In order to get all my data into my database I used the database seeding process.

When I had all my data stored I returned the data using the RESTful endpoints that I found suitable to get the information out from the data. Then I used Mongoose queries to find and return the correct data from the routes I created.

If I had more time I would implement frontend and pagination so the results only would show e.g. 20 objects.

## View it live

https://skotrum-mongo-project.herokuapp.com/
