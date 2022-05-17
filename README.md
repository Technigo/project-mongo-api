# Project Mongo API

This week I have built a small backend API. The requirements was to built an API that had at least 2 routes. Minimum of one endpoint should return an array of elements and minimun of one endpoint should return a single element. The API should be built as Mongoose models and it should be RESTful.

## The problem
For this project I've used MongoDB and Mongoose. I've also used MongoDB Compass tokeep track of my data. I had some issues deploying this database to Heroku, but that was solved by using Atlas Cloud and adding config vars.

In the project I've mainly used param paths which has worked fine. I also added a query path to practice this. I tried to use .toLowerCase in the endpoints so that the user wouldn't have to write correct upper and lower case letters, but I couldn't make it work for now. This I will look into more when I have the time. 

If I had more time I would also definately build a small front-end to display the data in a nice way. I would also look into why the 404-messages doesn't seem to work as expected.

## View it live

Deployed project: 

https://mongodb-database-topsongs.herokuapp.com/songs
