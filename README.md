# Mongo API Project

Get familiar with MongoDB and use it to store data and query that data from our API.
The requirements are a couple of RESTful endpoints, and to use Mongoose models to model the data and use these models to fetch data from the database.

## The problem

I found a dataset from Kaggle (BoardGameGeek Reviews) and started with seeding the data to the database. We basically iterate over the JSON file to generate entries in to the database.

We used Mongoose to model data in Mongo. Practice how to store secret information such as database passwords, and error handling which return useful error messages from the API endpoints. I also added pagination with Mongoose queries (skip() and limit()).

We can:

- GET endpoints,
- GET all reviews with pagination,
- GET one review with a specific id,
- GET one review randomly,
- GET list of reviews by year,
- GET ranked reviews sort from top to bottom

To practice if the endpoints are useful I've built a frontend to show the data.

## View it live

Heroku (API): https://boardgames-katie.herokuapp.com/ \
Netlify (frontend): https://bgg-reviews.netlify.app/
