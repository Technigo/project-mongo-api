# Mongo API Project 🎃
I have a little experience working with Express and making API endpoints, so this project is all about returning real data. This week I worked with how to use Mongodb to store data, and how to query that data from my API.

## The problem
It was a good chance to level-up my APIs and start using a database to store and retrieve data from and use that data to produce a RESTful API.
This time I had to model my database using Mongoose models, and persist my data in the database.

## Making seed data 🧞‍♂️
[Seeding a database](https://en.wikipedia.org/wiki/Database_seeding) is a process in which an initial set of data is provided to a database when it is being installed or set up. In this project, I can load the JSON and iterate over it to generate a lot of entries in the database. Let's say I had a file called `people.json`, and a `Person` model and the person model has exactly the same property names as the objects in the JSON file. Then I could write something like this in our server file to seed the database from the JSON. This whole process was a little tricky, and it heavily relies on my models having the same keys!!

## View it live
https://haruahn-project-mongo-api.herokuapp.com/
