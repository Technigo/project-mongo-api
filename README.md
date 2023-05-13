# Project Mongo API

This weeks project was about learning how to work with MongoDB , Compass, Atlas, Google Cloud.
✓ Your API should have at least 2 routes. Try to push yourself to do more, though!
✓ A minimum of one endpoint to return a **collection** of results (array of elements).
✓ A minimum of one endpoint to return a **single** result (single element).
✓ Your API should make use of Mongoose models to model your data and use these models to fetch data from the database.
✓ Your API should be [RESTful]
## What you will learn
✓ What MongoDB is
✓ How to model data in Mongo using Mongoose
✓ How to store secret information such as database passwords
✓ How to return useful error messages from your API endpoints
✓ How to fetch items from a Mongo database using Mongoose
✓ How to seed large amounts of data to a database

## The problem
I downloaded some CVSfile from Kaggle (Harry Potter info) and converted in into JSON (https://csvjson.com/)
Then I used it in my code in the data file as spells.js and characters.js.

The code in the project makes use of Mongoose models to model your data and fetch data from the database.
I define two schemas using mongoose.Schema(): charactersSchema and spellsSchema. Then, I create Mongoose models for each schema using mongoose.model(): Characters and Spells.

In the routes, I use these models to fetch data from the MongoDB database. For example, in the /characters/ID/:ID route, I use Characters.findById() to fetch a single character from the database based on its ID. In the /characters/name/:name route, I use Characters.find() to search for all characters whose names match a given string.

Therefore, my API uses Mongoose models to model your data and fetch data from the database.

/characters endpoint returns a collection of results (array of elements) containing all characters from Harry Potter Movies.
/characters/ID/:ID endpoint returns a single result (single element) based on the ID of the character.
/characters/name/:name endpoint returns a collection of results (array of elements) containing all characters that match the name passed in the request parameter.
/spells endpoint returns a collection of results (array of elements) containing all spells from Harry Potter Movies.

Seeding a database process:
The if statement checking for process.env.RESET_DATABASE triggers the seeding process if the environment variable RESET_DATABASE is set to a truthy value. Within the resetDatabase function, the deleteMany method is called on both Characters and Spells models to remove any existing documents in their respective collections. Then, the insertMany method is called on the Characters model to insert documents from the charactersPotter array, and the insertMany method is called on the Spells model to insert documents from the spellsPotter array. This process populates the database with data before starting the server.

## View it live
frontend:
https://stunning-brioche-6e0c54.netlify.app/
backend:
https://project-mongo-api-pb7rmnzmyq-lz.a.run.app

    Endpoints that i created:
        "/characters": "Display all Characters from Harry Potter Movies",
        "/characters/ID/:ID": "Search specific Character id",
        "/characters/name/:name": "Search for a name in Harry Potter Movies",
        "/spells": "Display all spells"