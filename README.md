# Mongo API Project

This project aimed at setting up and storing data in mongoDB, and query that data from an API that I build containing a dataset from spotify with the top songs on the billboard from 2010 - 2019.

## The features

Endpoints:

GET /tracks - to get the whole data with all songs
GET /tracks/index - to find a single item with the given index.
GET /tracks/titles/:title to get a single item with the given title
GET /tracks/artists/artist/:artist to get a single item with the given artist
GET /tracks/year/:year to get all the sings on a given year between 2010-1019
GET /tracks/genre/:genre to get all the songs that in genre
GET /tracks/bpm/:bpm to get all the songs with the given bpm

Other queries:

/tracks/artist/?artist=Rihanna
/tracks/genre/?genre=dance pop

all endpoints handles errors if the item can not be found or is invalid.

## View it live

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.
