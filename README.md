# Project Mongo API

This is a RESTful API built using Express and Mongoose to provide access to a dataset of Nintendo Switch games. The dataset includes game details like id, name, category, release_year, and rating. The project demonstrates how to model data with Mongoose, seed a MongoDB database, and build endpoints to query and retrieve data.

## The problem

The task was to create an API that fetches data from a MongoDB database using Mongoose. Key challenges included:

1. Modeling the dataset with Mongoose to ensure the data was stored consistently.
2. Seeding the database with a JSON file containing the dataset.
3. Creating RESTful endpoints for filtering and retrieving data based on parameters like category, release_year, and rating.
4. Writing clean and reusable code while adhering to RESTful principles.

To solve these challenges, I:

- Used mongoose to define models and interact with the database.
- Wrote a seeding function to populate the database.
- Used query parameters to add filtering and sorting functionality to the API endpoints.
- Tested the API with tools like Postman and debugged using console logs.

If I had more time, I would:

- Implement pagination using .skip() and .limit().
- Add more advanced querying using MongoDB's aggregate pipeline.
- Enhance error handling and validation of query parameters.

## View it live

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.
