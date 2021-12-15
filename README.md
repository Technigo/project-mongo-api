# Mongo API Project

Create an API backend using Express.
Using a database to store and retrieve data from and use that data to produce a RESTful API.

## Features

- model data in Mongo using Mongoose
- fetch items from a Mongo database using Mongoose
- store secret information using enviroment variables
- return error messages from your API endpoints
- seed large amounts of data to a database

## View it live

https://express-api-music.herokuapp.com/

Description of paths:
[
{
"path": "/",
"methods": [
"GET"
],
"middlewares": [
"anonymous"
]
},
{
"path": "endpoints",
"methods": [
"GET"
],
"middlewares": [
"anonymous"
]
},
{
"path": "/singles",
"methods": [
"GET"
],
"middlewares": [
"anonymous"
]
},
{
"path": "/singles/artist/:artist",
"methods": [
"GET"
],
"middlewares": [
"anonymous"
]
},
{
"path": "/singles/id/:id",
"methods": [
"GET"
],
"middlewares": [
"anonymous"
]
}
]
