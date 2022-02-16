# Mongo API Project

A project that consists of a Mongo-backed API. The goal for this project was to learn what Mongodb is and how to model data in Mongo using Mongoose. I used a set of avocado sales data to set up the database.

## The problem

I started by seeding the database from the json file. After storing the data I created the RESTful endpoints written below using Mongoose queries. I also made sure to provide error messages from the endpoints.

- "/" = Main page
- "/endpoints" = Shows all the endpoints
- "/sales" = Shows all the avocado sales in the data set
- "/sales/totalvolume/:totalvolume" = Filters sales by total volume (greater than/equal to the value that the user chooses)
- "/sales/lowestprice" = Filters the ten sales with lowest average price
- "/sales/highestprice" = Filters the ten sales with highest average price
- "/sales/id/:id" = Finds one specific sale based on id

## View it live

https://project-mongo-api-rephili.herokuapp.com/
