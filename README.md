# Mongo API Project

Database and API of netflix titles created with MongoDB, Express and Node.js

### Endpoints:
/shows - lists the 20 first shows in the API

/shows/type/movies - lists the 20 first shows of type movies

/shows/type/tv-shows - lists the 20 first shows of type TV-show

/shows/released/:year - lists the 20 first shows in the API that was released in the given year

/shows/:id - lists the show with the corresponding ID in the API

### Queries:
title - /shows?title={search word} lists every show which has the given parameter in its title

page - /shows?page={number} lists the 20 shows of that page in the API

limit - /shows?limit={number} limits the number of shows in the result

## The problem

I started with getting my data into the mongo database locally with the mongoose method mongoose.model(). Then I created the first route "shows" to make sure I could reach the data with mongoos method .find(). When this worked I started creating more routes and queries based on the data of the dataset, added error handling and more filter as I had the time. For example to limit the amout of results and picking what "page" to fetch. The API is then connected to Heroku and the database to the cloud with MongoDB Atlas.

## View it live

Deployed with Heroku: https://netflix-mongo-db.herokuapp.com/