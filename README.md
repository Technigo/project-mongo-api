# Mongo API Project

Creating API using MongoDB and Mongoose.

## The problem

The task was to use a database to store and retrieve data from and use that data to produce a RESTful API. Learning how to model data in Mongoose. Mongoose functions: find, findOne and sort.

ENDPOINTS: 

Root: `/`
Tracks: `/tracks`
Search tracks by genre: `/tracks/:genre` (`/tracks/:pop`)
Artists : `/artists`
Search chosen artist: `/artists/:artistName` (`/artists/:Ed Sheeran`)
Search tracks by chosen artist and sort on popularity: `/artists/:artistName/tracks` (`/artists/:Ed Sheeran/tracks`)

Queries:
Artists: `/artists` (`/artists?query=Ed Sheeran`)
Sort chosen track by chosen artist on popularity: (`tracks?trackName=love&artist?artistName=ariana&sort=rating`)


## Tech

- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript ES6

## View it live

https://project-mongo-deployment.herokuapp.com/tracks