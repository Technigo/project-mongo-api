# Mongo API Project

Goal:
To create and practice using a database (MongoDB) to store and retrieve data and create a RESTful API.

Tools Used:
-Express
-Mongoose
-Node.js
-MongoDB
-Heroku

I have created my own Data Collection of My Little Pony Characters to use in this project. I also created two other Collections based off this one to understand how to use multiple data collections in filtering Routes and Endpoints. 

I created a .env file to help keep my URL for the Database private to only me. I was also successful in linking my MongoDB to heroku with my data colleciton. 

Building my own data collection really helped me to understand how important it is to have seperate collections for information that needs to be easily added to without having to go through and change an entire collection object by object.


## The Current problem

- The current problem is involving multiple queries on one Route '/characters'. I have successfully set it up so that one can query character names (/characters?name='blahblah'). I have set up a second collection of types of ponies and populated it successfully here as well. However it is not filtering properly when writing in the query (t.ex: /characters?kind=unicorn). I am wondering if it has something to do with the new collection being an object array... and perhaps the way I've set up the query for name is not how it works on an object array... but I am unsure and need to research the issue more. 

Currently my { kind } query does not properly filter and my { residence } query does not even appear (despite being imported the same way as kind... but perhaps the syntax is not correct for multiple queries?).

How will I solve this? I am going to speak with my mentors who specialize in back end development as well as hit the googling. I have already begun reading more about the differences between params and queries to hopefully better understand the issue.

## View it live

https://mlp-mongo.herokuapp.com/