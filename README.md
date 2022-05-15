# Project Mongo API

A project to use MongoDB, seed the database and fetch the data from the database with Mongoose model.
The minimum 2 endpoints, one array of elements and one to return a single element.

## The problem

I wanted to have endpoints with both path params and queries. Also I wanted an explanation of routes in the "landingpage". This time I introduced the listEndpoints library in my project. I aimed for more errorhandling and more comprehensive endpoints with "includes" and "tolowercase" but ran out of time as I got some trouble with my mongoDB cloud account - not showing my database collecion. Got the tip from my Lions team to run resetDB in the terminal and also perhaps commment out the if statement of resetDB in the code. After a couple of resets, refreshs and pushes to Heroku it finally worked. For this project I also had great help of SO in order to create the cloud account.


## View it live

https://technigo-mongo-topmusic.herokuapp.com/
