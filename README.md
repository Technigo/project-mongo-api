# Project Mongo API

The aim of this project was to was create a database using mongoDB, use Monggose models to model data, seed and retrieve data from database + create a RESTful API with min. 2 routes (one endpoint returns an array and the other a single object)

## The problem

The most challenging part of this project was getting it started. For a long time, the app just kept crashing. After changing "mongodb://localhost/project-mongo" to "mongodb://127.0.0.1:27017/project-mongo", the app stopped crashing and I could finally get started.

I created to endpoints, and for the endpoint returning an array, I added pages using queries.

Deployment was a bit tricky as well. I followed the deployment guide and set up environment variables for MONGO_URL and RESET_DB. After doing 'npm install mongodb', it finally deployed.

Tools: express, mongoDB, mongoose.

If I had more time, I would:
- Use different data, either create something myself or find a fun dataset.
- Create a simple front end.
- Try Swagger
- Create more endpoints (and queries)
- Try Mongoose's aggregate() function

## View it live
https://project-mongo-api-lnyuqa6nqq-uc.a.run.app/
