# Week 18 - Technigo bootcamp

# Mongo API Project

This week we start using a database to store and retrieve data from and use that data to produce a RESTful API.
As before, it's up to you to decide what sort of data you'd like to store in your database and return from your API endpoints. In the repository, we've included some datasets you can use if you'd like.
Once you have the data stored, you will need to write appropriate RESTful endpoints to return the data and make use of Mongoose Queries to find and return the correct data given the route and any filter params passed.
- Your API should have at least 2 routes. Try to push yourself to do more, though!
- A minimum of one endpoint to return a **collection** of results (array of elements)
- A minimum of one endpoint to return a **single** result (single element).
- Your API should make use of Mongoose models to model your data and use these models to fetch data from the database.
- Your API should be [RESTful](https://www.smashingmagazine.com/2018/01/understanding-using-rest-api/)

## The problem

Once the database was configured and conected, I started building basic endpoints. I create a middleware to catch the search by id at hte beginning and then I create the basic operations:  get/ put/patch/post/delete. I used postman to made the requests and the compass to see the database locally.

## Seed Database with data

In the seed-db folder you will find the import script and a folder named `data`, with all the folders related with locations, movies, screenings and seat availability that will be saved in db. Every time you run this file, this specific collections of data will be drop and created again.

To insert/update all data in database:

1. npm install
2. npm run seedDb

## Route examples:
Get all books 
https://project-mong-api.herokuapp.com/books

GET books with limit: 
https://project-mong-api.herokuapp.com/books?limit=3

GET by author
https://project-mong-api.herokuapp.com/books/authors?authors=Fre

GET by title
https://project-mong-api.herokuapp.com/books/title/?title=Chan

GET by id
https://project-mong-api.herokuapp.com/books/61d6f1fd5845c70e407179e2

## View it live

See: https://project-mong-api.herokuapp.com/
