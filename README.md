# Mongo API Project

The project was to create a database using Mongo DB and than using mongoose to create endpoints with different sets of data.

## The problem

The tools used are Mongo DB to send and store data in the database and then Mongoose to manipulate the data to show the desired results. The approach was to begin to set up the database and then make the endpoints. The endpoints are case insensitive.

The endpoints in this project are: 
/ that displays all the endpoints in the api.
/songs that displays a collection of all songs in database
/songs/index/:index Shows a specific song based on index
/songs/name/:name shows a specific song based on the title of the song
/songs/album/:album shows all songs in a specific album
/songs/length/?length=anyNumber shows all songs longer than that number soecified in miliseconds

 
## View it live

https://swiftdatamongodb.herokuapp.com
