# Mongo API Project

This project was an introduction to Mongo DB and Mongoose. This is the first time we stored our data in a database. Then it was about creating RESTful routes to display the data.

## The problem

Having imported the data I set up the database in Mongo DB compass. Then the model Movie was created to handle each item in the data array. Different routes were created to show filtered data. Then I added some error handling in case the user entered invalid entries. Models in Mongoose were used for data and also Mongoose methods like find, findOne. Async and await was used to handle asynchronous operations. Path parameters and query parameters were used for the different endpoints.If I had more time I would have created another model and connected them.

## Endpoints

• Root: /

• movies: /movies (This gives data about all the nominated movies at Golden Globe)

• movies: nominee/nominee (Choose nominee to only get that specific nominated movie)

The following endpoints can be combined to filter even more:

• year_film: /movies?year_film=(Choose a film released year to get all the movies released that year)

• year_award: /movies?year_award=(Choose an award year to get all the movies of that award year)

• ceremony: /movies?ceremony=(Choose ceremony number to get all the movies for that specific ceremony)

• category: /movies?category=(Choose category to get all the movies for that specific category)

• nominee: /movies?nominee=(Choose name of nominee to get that specific movie)

• film: /movies?film=(Choose name of movie to get that movie)

• win: /movies?win=(Choose true or false to get movies that won/didn't win)


## View it live

https://golden-globes.herokuapp.com/