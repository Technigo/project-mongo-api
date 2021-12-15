# Mongo API Project

Build a project using a database to store and retrieve data from, then use that data to produce a RESTful API.
## What I learned

- How to model data in Mongo using Mongoose
- How to store secret information such as database passwords
- How to return useful error messages from your API endpoints
- How to fetch items from a Mongo database using Mongoose
- How to seed large amounts of data to a database

## Documentation 

GET /
Welcome page

GET /shows
Displays all shows in the dataset.

GET /shows/:id
Displays a single show based on the show_id parameter from the request URL. An error message will show when the show_id is invalid or no book is found with the id provided.

GET /shows?type=movie
Will show shows that have type movies or tv shows, an error will show up if no type is found. 

More queries: 
GET /shows?country=Sweden
Get shows by country 

GET /shows?title=Chocolate
Get shows by title 

Combine all of three queries for more specific results :) 

## View it live

https://dls-mongo-api.herokuapp.com/
