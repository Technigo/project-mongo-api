# Mongo API Project

The project of this week was to learn how to set up databases with MongoDB, to store and update data, and to work with RESTful APIs. We were also supposed to seed the database and to learn how to use the Mongoose model.

## The problem

This week I started by planning what kind of project I wanted to create, and decided to create a dataset with a collection of techsites with focus on programming. I started with building the dataset, and then started creating RESTful endpoints for the API. I created both a couple of endpoints to display one single result, and several endpoints to display an array of results. I also used query params, to filter on the techsite topic. After doing the more basic queries I also implemented aggregate where I have several query params and sort on name.

After setting up my first endpoints, I created my database with MongoDB and also deployed both my backend and my database. I set up an env file to keep my database user details hidden and made sure to add it to the gitignore file. I then created a corresponding frontend, where I also published my API documentation. 


## View it live

The backend is deployed here: 
https://techsites.herokuapp.com/

Frontend is deployed here:
https://techsite-collection.netlify.app/

API documentation can be read here:
https://techsite-collection.netlify.app/Documentation

And the database is deployed at Mongo DB Cloud Atlas.
