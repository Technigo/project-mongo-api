## Project 16: MongoDB API Project

Created my first API using MongoDB

## The process

- I got familiar with the database I chose to work with
- Read through MongoDB documentation
- Thought about some endpoint that would make sense
- Created endpoint using methods like find(), findOne() for filtering data and also comparison operators like $gte and $lt

## Focus

- How to build an API using MongoDB
- How to create routes in the API with Mongo
- Practice data manipulation methods with Mongo

## Challenges to solve

Connect different collections

## View it live

https://mongo-api-deployment-liza.herokuapp.com/

Enpoints:
https://mongo-api-deployment-liza.herokuapp.com/records - all the records

https://mongo-api-deployment-liza.herokuapp.com/records20 - first 20 records found

https://mongo-api-deployment-liza.herokuapp.com/records/id/3 - find a record by id, replace the 3 by record´s id

These 2 endpoints you can search by queries and put in any query you prefer instead of trackName or popularity:

https://mongo-api-deployment-liza.herokuapp.com/records?trackName=Se%C3%B1orita - find a record by queries, replace the name of the track by one you want to find

https://mongo-api-deployment-liza.herokuapp.com/records?trackName=Se%C3%B1orita&popularity=79 - find a record by a combination of queries, replace the name of the track and its popularity score

Endpoints created with regex:

https://mongo-api-deployment-liza.herokuapp.com/records/artists/shawn - find a record by artist name, replace shawn with an artist name you like, it is case insensitive and you can write just the name or surname

https://mongo-api-deployment-liza.herokuapp.com/records/song_name/if - find a record by song name, replace if with a song name you like, it is case insensitive and will come out even if you write only one word from the name of the song

Endpoints created with comperison operators:

https://mongo-api-deployment-liza.herokuapp.com/records/short - all records where the length of the track is shorter than 170

https://mongo-api-deployment-liza.herokuapp.com/records/dance - all the records where danceability id higher than 80
