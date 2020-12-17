# Mongo API Project

This project is done as a part of Technigo boot camp. 
The focus for the project was to model data in Mongoose, fetch items from a Mongo database using Mongoose and seed large amounts of data to a database.

## Endpoints

https://elle-mongo-api-project.herokuapp.com/books returns all books.
https://elle-mongo-api-project.herokuapp.com/books?title=TITLE search by title. shows book/books including title word. Not case sensitive.
https://elle-mongo-api-project.herokuapp.com/books?author=AUTHOR search by author. shows book/books including author name. Not case sensitive.
https://elle-mongo-api-project.herokuapp.com/books?rating=high sorts books on highest average rating.
https://elle-mongo-api-project.herokuapp.com/books?rating=high sorts books on lowest average rating.
https://elle-mongo-api-project.herokuapp.com/books?page=PAGENR shows requested page nr.
https://elle-mongo-api-project.herokuapp.com/books?limit=LIMITNR edits amount of search result for each page.

https://elle-mongo-api-project.herokuapp.com/books/book/BOOKID returns a single result based on bookID.

## TECH
Javascript
Node.js
Express
Mongoose
Mongo DB

## View it live

https://elle-mongo-api-project.herokuapp.com/
