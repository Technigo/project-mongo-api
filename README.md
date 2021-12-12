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

## View it live

See:
