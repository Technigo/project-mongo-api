# Project: Mongo API - Overview
Building my first Mongo db. 
Project done as a part of Technigo bootcamp.

Learning objectives:
- How to model data in Mongoose
- How to fetch items from a Mongo database using Mongoose
- How to seed large amounts of data to a database

<!-- ## Approach -->


## Core Tech
- MongoDB
- Mongoose
- Express
- Heroku
- Postman
- JavaScript


## Completed Requirements
🔵  Blue Level
- Your API should be deployed to Heroku or similar hosting service.
- Your database should be deployed using mongo cloud or similar.
- The API should have at least 2 routes.
- A minimum of one endpoint to return a **collection** of results (array of elements)
- A minimum of one endpoint to return a **single** result (single element).
- The API should make use of Mongoose models to model your data and use these models to fetch data from the database.
- The API should be [RESTful](https://www.smashingmagazine.com/2018/01/understanding-using-rest-api/)


🔴  Red Level (Intermediary Goals)
- On routes which return a single item, handle when the item doesn't exist and return some useful data in the response.
<!-- - Create some empty/dummy endpoints which could contain more complex operations in the future.  Find good names for them (think back to the labs) -->
<!-- - If you are doing any sort of manipulation after retrieving the data from the database.  Try using mongoose to do these operations instead. -->
<!-- - Accept filters via query parameters to filter (via mongoose) the data you return from endpoints which return an array of data. -->


<!-- ⚫ Black Level (Advanced Goals) -->
<!-- - Build a frontend which uses your API in some way to show the data in a nice way (use the [react-starter](https://github.com/Technigo/react-starter) template to get up and running fast). -->
<!-- - Create useful documentation for your endpoints. What's a good way to present this documentation?  What if it changes in the future?  Are there any npm packages that could help with this? -->
<!-- - Try implementing 'pages' using `[.skip()](https://mongoosejs.com/docs/api.html#query_Query-skip)` and `[.limit()](https://mongoosejs.com/docs/api.html#query_Query-limit)` (instead of `.slice()`) to return only a selection of results from the array. You could then use a query parameter to allow the client to ask for the next 'page'. -->
<!-- - Try to create an endpoint that uses [mongoose's aggregate function](https://mongoosejs.com/docs/api/aggregate.html#aggregate_Aggregate) which allows you to use the [MongoDB aggregate pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/). This is super-useful when doing more complex operations on database data, and a lot faster! -->


## View it live
