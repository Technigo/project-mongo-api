# Project Mongo API

This week's project involved using a MongoDB database to store and retrieve data. A RESTful API was created using that data.

## The problem


ENDPOINTS CREATED:

  **/episodes** - returns all the episodes with all their data. 

  **/episodes/top_5** - returns top 5 rated episodes
  

With path parameters:

  **/episodes/:id** - returns a single episode according to a specific id entered 

  **/episodes/seasons/:season** - returns all episodes of a specific season (1-9)


Filters that can be used with the following query params:

  **/episodes?title=searchedAfterTitle**  - search for a specific episode by title


## View it live

Google Cloud Platform is used to deploy the API:

https://project-mongo-api-u5vmpxdxpa-lz.a.run.app/
