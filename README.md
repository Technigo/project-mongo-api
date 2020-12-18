Mongo API Project 🍃

This project's main goal was to use MongoDB to build a database to store data, as well as, retrieve that data and use it to produce a RESTful API. Also it should be modelled and manipulated using mongoose.



Planning & What I learned 🧩

The first step of this project was actually to read through MongoDB's documentation, install it and connect it to MongoDB Atlas, so my API could be deployed to Heroku.
After everything was up and running I started looking at the data - I chose the songs dataset - and started planning some possible endpoints. Since we needed to use mongoose to model and manipulate the data, I then went ahead and create the mongoose model and started to build my endpoints with mongoose operators like find() & findOne()
I had some problem with the resourcing on Herokup and was finally able to solve it with some help.
Learned a lot about error handling!



Endpoints 💫

/

Root: Welcome page

/topsongs

Shows all songs in the dataset

/topsongs/tracks?genre=:genre
/topsongs/tracks?length=:length
/topsongs/tracks?popularity=:popularity

Shows the songs that match totally or partially the searched genre, song length and popularity respectively.

/topsongs/tracks/:id

Shows a single song based on that song's id parameter.



Tech ⚡️

MongoDB
Mongoose
Node.js
Express
Heroku


View it live 🔴

songs-dummy-data.herokuapp.com
