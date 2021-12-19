# Mongo API Project

The project was to start using a database to store and retrieve data from and use that data to produce a RESTful API. 

## The problem

Due to time managment issues I didn't have a lot of time to spend on this project, but these are the things I learnt:
- What Mongodb is
- How to model data in Mongo using Mongoose
- How to store secret information such as database passwords
- How to return useful error messages from your API endpoints
- How to fetch items from a Mongo database using Mongoose
- How to seed large amounts of data to a database

## View it live

https://project-mongo-api-kim.herokuapp.com/

API endpoints: 
- Starting endpoint: /
- Endpoint listing all data: /books
- Endpoint for a specific book, searching on the bookID, for example: /books-id/24
- Endpoint for when searching on a specific book title, for example: /books-title/In a Sunburned Country
- Endpoint for when searching on a specific author, for example: /books-authors/Bill Bryson
