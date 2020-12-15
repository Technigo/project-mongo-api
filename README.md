# Mongo API Project 🍃
This project's main goal was to use MongoDB to build a database to store data, as well as, retrieve that data and use it to produce a RESTful API. Also it should be modelled and manipulated using mongoose.

## Planning & What I learned 🧩
- The first step of this project was actually to read through MongoDB's documentation, install it and connect it to MongoDB Atlas, so my API could be deployed to Heroku. 
- After everything was up and running I started looking at the data - _I chose a different dataset this time so I get used to diffenret data sets_ - and started planning the possible endpoints. Since we needed to use mongoose to model and manipulate the data, I then went ahead and create the _mongoose model_ and started to build my endpoints with mongoose operators like find(), findOne() and $gte to filter even more my top songs list by the most popular songs.
- When I started testing my endpoints I encountered some issues related to case sensitive text, as well as, the genres in the dataset were all in the same string, this would make it difficult to get a match unless we would know all the data, so I needed to use _Regex_ for the artist enpoint and genres query. 
- Learned a lot about error handling! 

## Endpoints 💫
### / 
Root: Welcome page 
### /topsongs
Shows all songs in the dataset
### /topsongs?genre=:genre
Shows the songs that match totally or partially the searched genre.
### /topsongs/most-popular
Shows the top songs with popularity over 90.
### /topsongs/songs/:id
Shows a single song based on that song's id parameter. 
### /topsongs/artists/artistName
Shows a song by a specific artist that matches totally or partially the artist's name. 

## Tech ⚡️
- MongoDB
- Mongoose
- Node.js
- Express

## View it live 🔴
[Top Songs API 🎶](https://songs-api-mongodb.herokuapp.com/)
