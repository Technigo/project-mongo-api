# Mongo API Project

This is a project to practice Express, writing endpoints with mongoose and upload it to a database, in this case MongoDB.

## The problem

I started with downloading MongoDB Copmpass and get my accounts up in MongoDB. I connected the project to Postman and MongoDB. I installed the packages and dependencies, and then started by writing the mongoose model by following the data achieved in Postman. I then seeded the data to the database and also wrote a reset function to stop it from reseeding. I then went on and wrote the endpoint, which is quite straight forward. Lastly I did some error catching once again in Postman, and by adding 404-status to the endpoints, as well as a 400-status. I also added an error status 503 to the middlewares to show a message if the database is down. Lastly I deployed the project to Heroku and connected it with MongoDB Cloud Atlas.

If I had more time I would like to add queries to filter the shows and also add some frontend to use the data with. I also want to add some error messages that I'm missign right now.

**The aviable endpoints are:**

/ - *lists all endpoints*

/shows - *lists all the shows*

/shows/:id - *endpoint to look for a specific shoe by using the Mongo-ID*

/shows/title/:showTitle - *endpoint to look for a specific show by using the title*

## View it live

Here you can see the live project deployed on Heroku: https://errys-movie-list.herokuapp.com/ Follow the documentation above to see what endpoints you can use. The app also starts by listing all the endpoints.