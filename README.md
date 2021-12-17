# Mongo API Project

This is a backend project which models a database using Mongoose models, persisting data in a database, and uses that data to produce a RESTful API. The API has a bunch of routes to get to different endpoints. The data has been manipulated, using mongoose operations and queries, so that different data is displayed depending on the endpoint.

## The problem

I started the project by downloading homebrew, MongoDB and Mongo Compass to get the app running and connected to Mongo Compass. I chose a JSON file to work with (books) and created a mongoose model that includes the properties from the objects in the JSON. I installed express list endpoints to create a first route that will display all endpoints.
To get the data into the database, I seeded it from the JSON by loading and iterating over the objects in it.
I then started building different endpoints to get all books and a single book by its ID (the one that it created by mongoose). I used Mongoose operators to create more endpoints, so that the user can find books depending on the title, author, amount of pages and rating. If there is a problem getting data in an endpoint, an error message appears.
Once having a bunch of endpoints, I deployed the database and connected it to the heroku by adding a secret config var.
If I had more time I would create a frontend webpage to fetch and display the data from the API.

## View it live

https://johannamj-books-data.herokuapp.com/
