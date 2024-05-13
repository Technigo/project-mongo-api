# Project Mongo API

Utilize MongoDB and Mongoose to model a dataset of Netflix titles with RESTful API endpoints and Mongoose queries for efficient data retrieval and manipulation. 

Implement features such as pagination to enhance the functionality of the API.

## The problem

Had to refer to documentation to implement pagination. 
I would like to continue working on the frontend.

## View it live
Backend:
https://project-mongo-api-z0mw.onrender.com

Frontend:
https://melodic-gnome-35f6b0.netlify.app/
https://github.com/jyy009/project-mongo-api-frontend

## Endpoints
"/titles" Fetch all Netflix titles. Query by: name, type, cast, country.
"/titles/year/:year" Fetch titles by year.
"/titles/:titleId" Fetch one title by it's id.

## Queries
"name": Filter titles by title name.
"type": Filter titles by type of title, either 'tv' or 'movie'.
"cast": Filter titles by cast.
"country": Filter titles by country.
