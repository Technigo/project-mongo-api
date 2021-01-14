# Mongo API Project

This week was an introduction to **MongoDB** and **Mongoose**. The project objective is create a database to store and retrieve data from and use that data to produce a **RESTful API** in **Node.js** using **Express**. The database needed to be built using MongoDB, modelled and manipulated using mongoose.

## The problem

I chose to use data from Rolling Stones top 500 albums of all time. My first task was to get my database up and running in MongoDB. I used Mongoose to create a **model** and seeded my database.
Once my database was working I began creating the different endpoints. I use mongoose **readySate** and the **next** function to return any database connectivity errors if there are any and to continue on if the connection ready state is connected.

## Endpoints

### /

Welcome page - contains a list of available routes

### /albums

Returns an array of all albums - or query results
Here I use a handy line of code which will return all albums unless there is a query. This enables all available data fields to be queried with multiple queries also possible
query example: /albums?artist=The Beatles&year=1965

### /albums/:position

Returns single object item

### /albumid/:id

Returns single object item

## Tech

- MongoDB
- Mongoose
- Node
- Express
- JavaScript
- Heroku
- MongoDB Atlas & Compass
- Postman

## View it live

My API can be found here:
https://jamie-albums-api.herokuapp.com/
