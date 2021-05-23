# Mongo API Project

This is an API bilding project where I am deploying MongoDB in a cloud/ Atlas. MongoDB cloud. 
The app has several endpoints and routes and using database of books. The project was created in the framework of Technigo bootcamp for front-end development.  



## The problem

Main problem was deploying database in a cloud. It is done by setting up .env file, containing url to db with password, installing dotenv with npm and importinmg it into server.js file and starting configure that file there.
This file shall be included in gitignore.

After the first deployment the second line in config file needs to be removed otherwise the database will be reseeding all the time. (RESET_DB=true)

## View it live

The app is alive on my Heroku repository:
https://vlad-api-mongodb.herokuapp.com/

