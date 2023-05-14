# Project Mongo API

Create a restful API using Express to provide routes & endpoints
Use mongoose to define data models and the structure of the data.
Use mongoose to fetch items from Mongo database
Seed large amount of data to database

## The problem

I started with choosing a dataset, that I converted to json file.
My dataset did not need any modifications, so I added all properties to my mongoose schema.
Then I set up the data to be seeded to the database.
After that I started with creating the different routes and finally adding more endpoints by query params. It was a bit tricky to learn the new syntax used with mongoose. I look forward to next week when we will get even more practice with those.
Deploying the API went well and I got an introduction to env. variables and were to add them.
I ran into major problem when deploying my database to Mongo Atlas. But after comparing all settings to my team mates, we discovered the missing piece.

There is a problem with the service showing as unavailable some times, then when you refresh it shows the result.

## View it live

[API connected to Mongo Database](https://project-mongo-api-g54dl7acxq-lz.a.run.app/)

[Swagger documentation for the API](https://project-mongo-api-g54dl7acxq-lz.a.run.app/api-docs/)