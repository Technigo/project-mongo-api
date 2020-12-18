# Music Database & API

This database contains a list of fifty music tracks from the last couple of years. You can reach the data via an API. I built this project during the Technigo bootcamp fro frontend developers in fall 2020.

## What it does

The catabase contains a set of fifty songs and some information about them:
- the track name
- the artist(s) name
- the genre
- the beats per minute (bpm)
- a popularity rank
You can search the data through API endpoints.

## The approach

The project's data is is stored in a JSON file inside the project. The server.js-file will populate a Mongo database with data from the file. It will store it in two collections, one for artists, one for music tracks. To do this, it follows mongoose models for an artist or a track respectively. 

The database is populated throug a seedDatabase-function. 

Moreover, I created endpoints to access the data via an API. You can reach lists of all tracks and all artists as well as search for a specific artists or track by its id. You can also access a list of tracks by a certain artist. 

There is even the option to query for all properties of a track and for the parameter "isPop" that will give you all the tracks from different pop genres like dance pop, electropop, australian pop etc.
When querying for an artist by his/her name, the parameter isn't case sensitive and will give you every artist whose name inludes what you were looking for. 

## Tech used

- ES6
- Express
- Mongo DB
- Mongoose

## View it live

You can access the project here: https://week18music50.herokuapp.com/tracks 
