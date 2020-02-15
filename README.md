# API using MongoDB

It was time to level-up my backend skill and start using a database to store and retrieve data from and use that data to produce a RESTful API.

## The problem and approaches

This project is a follow up on a previous project, where I created an API which was using Netflix movie data from a JSON file. In this project I stored the data in a MongoDB database.

I started by defining the "Show model" and its properties. Since I every time the Express server restarted the data was seeded into the database, I used the environmental variable <code>RESET_DB</code> to control if database should be reset, or not before each run.

## Endpoints

- API root: https://mongo-api-by-nasim.herokuapp.com/
- ***Since I'm using pagination I decided to return the data from the <code>/shows</code> endpoint as an object with metadata to be able to display total number of movies for a search result on the frontend side. You will find it in the JSON like this***<code> {
  "total_shows": 1375,
  "shows":[{data object}]
  }</code>
- To get all the shows: https://mongo-api-by-nasim.herokuapp.com/shows
- To get a specific show: https://mongo-api-by-nasim.herokuapp.com/shows/id/81082007/
- To filter shows by its title: https://mongo-api-by-nasim.herokuapp.com/shows?title=people
- To filter shows by the release year: https://mongo-api-by-nasim.herokuapp.com/shows?year=2015
- To filter shows by genre: https://mongo-api-by-nasim.herokuapp.com/shows?listed_in=stand-up
- To filter shows by title, release year and genre:  https://mongoapibynasim.herokuapp.com/showstitle=strong&year=2017&linsted_in=dramas

## Technologies used 💻
- Express
- MongoDB
- Mongoose 
- Node.js

## View it live 🎯

- The Backend: https://mongo-api-by-nasim.herokuapp.com/
- The Frontend: https://react-movie-search-by-nasim.netlify.com/

React frontend repository can be found here: https://github.com/Nasimmhn/react-movie-search
