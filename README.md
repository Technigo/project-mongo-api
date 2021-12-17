# Mongo API Project

## The problem

This is my second API project. I learned to modifie Express queries from a previous project to Mongoose. I used the same set of data for both projects, a database of popular songs from spotify.
This week I started using enviornment variables as well.

- Mongoose methods such as gt, find, findById, findOne
- RESTful endpoints
- Endpoints returning a single result and endpoints returning a collection of data.
- Error handling on all endpoints

It was a challange using Mongdb for the forst time, getting the whole setup and later the deplyment to work. It made me analyze my code alot in order to find possible errors.

## Documentation

Show all endpoints:
/endpoints

Show all songs in the database
/songs

Filter songs by id
/songs/id/:id

Filter songs by title
/songs/title/:title

Show all songs by a specific artist
/songs/artist/:artist

Show all songs in a specific genre
/songs/genre/:genre

Filter by a minimum of bpm by this form (change 110 to your chosen bpm):
songs/?bpm=110

## View it live

https://topmusic-mongodb-maria.herokuapp.com/endpoints
