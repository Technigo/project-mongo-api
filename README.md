# Mongo API Project

In this project I continue to work with a dataset from Netflix and create a database with MongoDB. I make use of Mongoose models to model my data and use these models to fetch data from the database.

## The problem

I have created the following endpoints:

- '/' - start
- '/endpoints' - provides all endpoints
- '/countries' - provides a sorted list of all countries that are in netflixData
- '/countries/:country' - route with all shows (both movies and other) from the provided country
- '/people' - route provides all Netflix-shows and has the possibility to query for director and cast in the database. The RegExp for makes the filtering caseinsensitive and provides the possibility to just search for parts of the word.You can also do pagination by setting skip & limit as query parameters
- '/shows' - route provides all Netflix-shows and has the possibility to query for every Entry in the database. SearchTerms have to be precise.
'/shows/:id' - provides one movie by ID
'/movies/title/:title' - provides one movie by title

Learnings:
- What Mongodb is
- How to model data in Mongo using Mongoose
- How to store secret information such as database passwords
- How to return useful error messages from your API endpoints
- How to fetch items from a Mongo database using Mongoose
- How to seed large amounts of data to a database

If I would have more time, I'd build a frontend.

## View it live

Visit my project: https://nehrwein-mongo-api.herokuapp.com/
