# Project Mongo API

This is a project where I got to play with mongodb and mongoose.
I created my own database and created an api to do CRUD operations.
If i had more time i would look into making a frontend for this project, and dvelve further into creating an index for search purposes for the frontend.

## The problem

I started out with reading about the requirements for the assignement. Then I started working on it like i did with the previous task, and then looked up how i need to rewrite it to use mongoose methods.
after a made a lot of endpoints, added some filters, and then added the possibility to add, update and delete entries in my db.
afterwards i tried to clean up my server file and split it into a file for the model, then a file for all routes, and a file for seeding the database who will run if i choose to run npm run seed.


## View it live

[View it live](https://project-mongo-api-5ryp.onrender.com/)

## Code Files
Here are the main code files in the project:
- `server.js`: This file is responsible for running the server with a typical setup for a server-side application using Express.js and mongoose for interacting with MongoDB.
- `book.js`: This file contains the model and schema definition for the "Book" entity in the API.
- `routes.js`: This file defines the routes and handlers for the API endpoints.
- `seeddatabase.js`: This file is used to populate the database with initial data.
