# Mongo API Project

In this project I learned about MongoDB and Mongoose. I have used the API Golden globes nominations 2010-2019. 

## The problem

First I had to seed the MongoDB with the data from my API. In order to do that I had to model data in Mongoose. It was a bit tricky to get everything in place, and in order to get the data into the MongoDB compass, a crucial step is to write: RESET_DATABASE=true npm run dev in the terminal. By doing this we first clear the database and then save the data. Since the code is asynchronous, we have to use async/await, otherwise the same data will be added to the database everytime we save.

I then created endpoints to return a collection of results as well as single results using Mongoose queries.

## View it live

https://project-mongo-api-ingela.herokuapp.com/

Shows and array of all nominations: https://project-mongo-api-ingela.herokuapp.com/nominations

Shows one object with a specified name (a nominee, could be a film or an actor): https://project-mongo-api-ingela.herokuapp.com/nominations/nominee/Sandra%20Bullock

Shows all objects from a specified year (year of the award): https://project-mongo-api-ingela.herokuapp.com/nominations/year/2019

In this endpoint we can query for all kind of information in the objects, for example to see all the movies that have won we could add this to the base URL: ?win=true. https://project-mongo-api-ingela.herokuapp.com/nominations?win=true

or use two queries like this ?win=true&nominee=Claire Danes: https://project-mongo-api-ingela.herokuapp.com/nominations?win=true&nominee=Claire%20Danes

Shows a specified category: https://project-mongo-api-ingela.herokuapp.com/nominations/category/Best%20Motion%20Picture%20-%20Drama
