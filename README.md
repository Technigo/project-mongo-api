# Project Mongo API

Utilize MongoDB and Mongoose to model a dataset of Netflix titles with RESTful API endpoints and Mongoose queries for efficient data retrieval and manipulation. 

Implement features such as pagination to enhance the functionality of the API.

## The problem

Describe how you approached to problem, and what tools and techniques you used to solve it. How did you plan? What technologies did you use? If you had more time, what would be next?

## View it live

## Endpoints
"/titles" Fetch all Netflix titles. Query by: name, type, cast, country.
"/titles/year/:year" Fetch titles by year.
"/titles/:titleId" Fetch one title by it's id.

## Queries
"name": Filter titles by title name.
"type": Filter titles by type of title, either 'tv' or 'movie'.
"cast": Filter titles by cast.
"country": Filter titles by country.
