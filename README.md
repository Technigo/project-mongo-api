# Project Mongo API

This week's project involved using a MongoDB database to store and retrieve data from. A RESTful API was created to query data from MongoDB.

## The problem

A dataset with episodes of the TV series The Office was used for this project - a CSV file was downloaded from Kaggle and converted to JSON using cvsjson.com. 
Mongoose was used to model and store the data into the database, and fetch data from the database. 


ENDPOINTS CREATED:

  **/episodes** - get all the episodes with all their data. 

  **/episodes/ratings/top_5** - get 5 best rated episodes

  **/episodes/ratings/bottom_5** - get 5 worst rated episodes

  **/episodes/views/most_viewed** - get the most viewed episode of the show

  **/episodes/views/least_viewed** - get the least viewed episode of the show

  
With path parameters:

  **/episodes/:id** - get a single episode according to a specific id entered (e.g. 637e423a77f854a4ec9070f5)

  **/episodes/seasons/:season** - get all episodes of a specific season (1-9)


Filters that can be used with the following query params:

  **/episodes?title=searchedAfterTitle**  - get a specific episode by title. Needs to be case sensitive.


## View it live

Google Cloud Platform is used to deploy the API:

https://project-mongo-api-u5vmpxdxpa-lz.a.run.app/
