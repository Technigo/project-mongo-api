# Mongo API

It was time to level-up my APIs and start using a database to store and retrieve data from and use that data to produce a RESTful API.

## The problem and approaches

This project is following up my previous project, which I created an API using Express and the data was have taken from Netflix. In this project I stored and retrieved all data to the database. 

I started by defining "the Show model" and its properties. after I noticed that the data was seeding everytime the database  loads, I stored the <code>db.collection.deleteMany()</code> metod in an environment variable, which prevent the duplicating of existing datas.

### Endpoint examples
## Returning JSON (click links)

- API root: https://mongo-api-by-nasim.herokuapp.com/
- I decided to send an object which shows the length of the data to make it easy for frontend part.
- To get all the shows: https://mongo-api-by-nasim.herokuapp.com/shows
- To get a specific show: https://mongo-api-by-nasim.herokuapp.com/shows/id/81082007/
- To filter shows by its title: https://mongo-api-by-nasim.herokuapp.com/shows?title=people
-To filter shows by the release year: https://mongo-api-by-nasim.herokuapp.com/shows?year=2015
-To filter shows by genre: https://mongo-api-by-nasim.herokuapp.com/shows?listed_in=stand-up
-To filter shows by title, release year and genre:  https://mongoapibynasim.herokuapp.com/showstitle=strong&year=2017&linsted_in=dramas

## Technologies used 💻
- Express
- MongoDB
- Mongoose 
- Node.js


## View it live 🎯

-The Backend: https://mongo-api-by-nasim.herokuapp.com/
-The Frontend: https://react-movie-search-by-nasim.netlify.com/

