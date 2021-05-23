# Mongo API Project
This was a project made during the Technigo bootcamp. The aim was to use a database to store and retrieve data from, and use that data to produce a RESTful API. 

## My project
I used a dataset about bookreviews. My API contains queries for filtering on author, title and language, and if neither is queried all books/objects will be shown. If the query doesn't return a result the API will show an empty array. I made params to find ID and ISBN. If nothing is found an error message is shown. There's also an endpoint to get a top-10 list of books with highest average rating in reviews. 

## Techs/tools used
* Node.js
* Express
* JavaScript
* MongoDB
* Mongoose
* Postman

## Endpoints
* '/' - See a list of endpoints
* '/book' - See all books
* '/books?author=[...]&title=[...] - Search for authors and/or title
* '/books/[id] - Search for book by ID
* '/books/isbn/[isbn] - Search for book by ISBN
* '/books/top10' - Get a list of the 10 books with the highest rating

## View it live
https://books-mongodb.herokuapp.com/
