# Mongo API Project

Replace this readme with your own information about your project.

Start by briefly describing the assignment in a sentence or two. Keep it short and to the point.

## The problem

This is my second API project. I learned to modifie Express queries from a previous project to Mongoose. I used the same set of data for both projects, a database of populaar songs from spotify.

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

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.
