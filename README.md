# Mongo API Project

This week I've produced Golden Globes nominations API using mongoose model and Mongo database as a weekly project for Technigo bootcamp.

## The problem

One of the problems was how to have several queries working under one single endpoint. This was solved by having if else statement so that if there is a query, the await function can filter the API results based on the query. 

Another problem was to filter the nominations that won with query. Here I couldn't use RegExp because the value of this query(win) is boolean and I couldn't figure out how to pass in boolean value in ReqExp. So I skipped using RegExp and instead used .where() to filter the results based on the key 'win'.

I had problem deploying the app on Heroku where it would return an empty array. This was caused because the database wasn't seeded yet. Seeding the database is dependent on resetting the database and this was set as an if statement. Therefore I needed to add the key RESET_DATABASE and its value as true in the configuration variables in my Heroku settings. 

## View it live

https://mongo-backed-api.herokuapp.com/

You can use query "nominee", "category", "year", "win", and "page" with the endpoint /nominations to filter the API results. 
e.g. /nominations?nominee=parasite
     /nominations?category=Best Director - Motion Picture
     /nominations?year=2019
     /nominations?win=true
     /nominations?page=20
And to return a single result, you can use query "id" (mongoose id) with the endpoint /nomination to filter the results.
e.g. /nomination?id=5ec3942d74689e6564b441c2
