# Project Mongo API

This week we started using a database to store and retrieve data from and use that data
to produce a RESTful API.
We model our database using Mongoose models.
We learned how to use the MongoDB compass.
How to write appropriate RESTful endpoints to return the data and make use of
Mongoose queries to find and return the correct data given the route and any filter params passed.
We also talked about error handling.

## The problem

I used a data set I found on kaggle that I converted from a CSV to a JSON about
the top 44 healthy cities in the world 2021.
The dataset shows the city and its rank,
City info: sunshine hours, cost of a water bottle, pollution index, annual hours work, outdoor activity, number of takeout places, cost of a monthly gym membership.
Country info: obesity level, life expectancy years,happiness level.

The routs I've done are for all the data /healthyLifestyles
a route for only one city /healthyLifestyles/:city
a route for the rank a city is in /healthyLifestyles/rank/:rank
a route showing the cities with sunshine hours over 2600 /healthyLifestyles/top/sunshineHours

## View it live

https://project-mongo-api-week18.herokuapp.com/
