# Project Mongo API

This is an API, connected to Mongo DB, with a list of books. They can be filtered by id or author. Querys can be made to search for a title or to sort by rating. 

## The problem

I found it pretty easy to seed the database, but then I struggled with filtering och the differnt paths. I wanted the books-by-author page to be at /books/:author. But after spend quite a long time trying to debug the code, and seeing this page crash every time, I realised that it took the authors name as an id (from /books/:id), so I had to change it to /books/author/:author. In the process of debugging (looking at other people's code, StackOverflow etc) I did however find how to search for the author (and later the title) without typing the full name and without it being case sensitive. That is something I am happy about.

## View it live

https://books-mongo-api.onrender.com/
