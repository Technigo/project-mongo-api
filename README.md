# Project Mongo API
REST API using Heroku and a MongoDB with 450 books using the mongoose model to fetch.

Routes:

    "/authors  return array with all authors",
    "/authors/id/:id  returns one author by id",
    "/authors/id/:id/books  returns array with all books by one author",
    "/books  return array with all books",
    "/books/id/:id   returns one book by id "

  
Queries: 

    "/authors?name='name'  returns array with authors whose names contain the string provided",
    "/authors?id='id'  returns one author by id"

## The problem

I would like to add more routes and perhaps a few more queries. The dataset doesn't have any boolean values so I would like to try it with a different dataset as well to try that. 

## View it live

https://week-18-project-mongo-api.herokuapp.com/
