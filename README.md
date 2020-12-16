# Mongo API Project
This project was made during the Technigo Bootcamp. The goal was to practice how to use Mongodb to store data and how to query that data from an API using mongoose operations.  

## What i've learned

- I've created endpoints and i've used mongoose operations instead of vanilla JS since the data needed to be manipulated.
- I've learned how to use the mongoose methods find() and findOne().
- I've created an account on Mongodb Atlas and succesfully manage to store my data. 

## Routes 

GET /welcome 

GET /books - displays 500 books

GET /books/book/:bookID - displays a single book based on the bookID parameter. Error message will show if the bookID is invalid.

GET /books/authors/:authorName  - displays books by a specific author. I've added Regex so that the search will be non-case-sensitive and and Error will show if no author is found.  


## View it live
https://books-api-technigo.herokuapp.com/
