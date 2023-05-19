# Project Mongo API
This weeks project was to build a mongo database and create a schema and mongoose model to fill it with data and then deploy it via Google Cloud.
The datebase uses environmental variables for resetting the database and for storing the API-key.

## The problem
The goal was to construct a minimum of two endpoints, one returning an array of objects and one returning a single object. I created the following endpoints:

The API includes the following endpoints:
GET "/" - welcome page and list endpoints
GET "/prizes" - for full list of Ig noble Prizes
GET "/subjects" - for sorted by subject, 
/subjects also includes a query for searching content which returns case-insensitive regex matches.
Example: /subjects?subject=bio, returns all subjects including the letters 'bio', like biophysics, biology, biodiversity...
GET "/years/:year" - for all prizes from a year e.g /years/2001
GET "/id/:id" - for a single prize by unique id (created by Mongodb)

## View it live
Find the deployed version here:
https://project-mongo-api-xgv6kwchzq-lz.a.run.app/
