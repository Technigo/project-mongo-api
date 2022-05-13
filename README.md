# Project Mongo API
The purpose of this project was to build a Mongo-backend API by using MongoDB as a database to store and retrieve data from. The data should then be used to produce a RESTful API.

## API Endpoints
### path: "/" 
List of all endpoints with method
### path: "/songs" 
Get array of all songs
### path: "/songs/song/:artistName" 
Get song by artist name (example: "/songs/song/ed sheeran")

## Tech
- MongoDB
- Mongoose
- Node.js
- Express

## The problem
My first approach to this project was to use Beatles albums data, however I had issues with the seeding and server app crashing. I then tried with the topMusic data that I used in my previous project and it worked fine locally. When deploying the project to Heroku the database only showed empty arrays. I solved this by adding RESET_DB true under Config Vars in Heroku deploy settings.

If I hade more time I would like to troubleshoot the Beatles data problem further.

## View it live
https://lisen-project-mongo.herokuapp.com/
