# Mongo API Project 

The aim of the project was to learn how to use Mongodb to store data, model data, return error messages and fetch items from a Mongo database using Mongoose. The API is built with Node on Express and the aim of the enpoints is to follow RESTful standards. A dataset of Netflix titles was used for this project 🎥.

## Documentation

<b>GET /</b>  <br>
Welcome page

<b>GET /shows</b>  <br>
Displays all 1375 netflix titles in the dataset.

<b>----Query Params----</b>

<b>GET /shows?type=</b>  <br>
Filters the dataset by type

<b>GET /shows?country=</b>  <br>
Filters the dataset by country

<b>GET /shows?release_year=</b>  <br>
Filters the dataset by release year

<b>GET /shows?director=</b>  <br>
Filters the dataset by director

<b>----Path Params----</b>

<b>GET /shows/title/:title</b>  <br>
Displays a netflix title based on the title parameter from the request URL.

<b>GET /shows/id/:id </b> <br>
Displays a netflix title based on the unique id parameter. An error message will show if no titles are found by that id

## View it live
https://mtdotse-netflix-mongo-api.herokuapp.com/shows
