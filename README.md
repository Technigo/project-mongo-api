# Mongo API Project

This project's goal is to look at how to use **Mongodb** to store data, and how to query that data from and API. This database is built using MongoDB, modelled and manipulated using **mongoose**. Then the **API** server is built with **Node on Express** and the aim is for my endpoints to follow **RESTful** standards. Some endpoints manipulate the data returned by making use of mongoose's specific **query comparison operators**. I'm once more using a Books-related dataset for this project 📚✨

## How I built it - What I learned

- My first step was to get my database to work on **MongoDB Atlas**, since I knew my API server had to be deployed to Heroku. There were a lot of steps to follow, so it was a bit hard figuring out where to start, but once it was up and running, the rest of the project was smoother. Good point to remember while doing this setup was to add all needed Config Vars to Heroku so the database will be seeded and run as intended 😁
- Once I had the database working, it was time to create the different **endpoints**: different from my previous project, this time the data needed to be manipulated with **mongoose operators** instead of vanilla JS. So I learned about mongoose methods to **find() and findOne()**, and also logical and comparison operators like **$gte** which I'm using on the Top Rated endpoint.
- I also had to make use of a **regular expression** in order to get my Search by Author endpoint to work. Since we don't manipulate data with vanilla JS (toLowerCase()), a regex is needed to make this find case-insensitive.
- Interesting also to learn about **environment variables** and how they are used. Key part in order for my Atlas hosted database to connect to my Heroku server app 💪

## Documentation - CORE ROUTES

Some useful details on the main endpoints for this API 🤓📕
### GET /
Welcome page
### GET /books
Displays all 500 books in the dataset.
### GET /books/book/:bookID
Displays a single book based on the bookID parameter from the request URL.
An error message will show when the bookID is invalid or no book is found with the id provided.
### GET /books/authors/:authorName
Find books by a specific author: will perform a search comparing the :authorName value in the request URL vs the "authors" property on each book in the database.
This search is non-case-sensitive and will also show results even if the name is partially included in the "authors" string.
An error message will show if no books are found by that author, double check author name.
### GET /books/top-rated
Will show books from the database that have an "average_rating" property equal or higher than 4 ⭐
### GET /books/top-rated?quickRead=true
Will show books that are both Top Rated and have less than 600 pages.

## View it live

FOR LIMITED STORAGE REASONS, HAD TO TAKE THE SERVER DOWN FROM HEROKU 😥 (So it's not currently deployed anywhere) - Powered by MongoDB, you can find this Bookish API live on Heroku at: https://vane-books-mongo-api.herokuapp.com/
