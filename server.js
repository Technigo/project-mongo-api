import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import charactersPotter from "./data/characters.json";
import spellsPotter from "./data/spells.json";

/*
express: A popular Node.js framework for building web applications.
cors: Middleware to enable Cross-Origin Resource Sharing (CORS), which allows the server to respond to requests from different origins (domains, protocols, and ports) other than its own.
mongoose: A MongoDB object modeling tool designed to work in an asynchronous environment. It provides a schema-based solution to model data and handle relationships between data, as well as query and validate data.
charactersPotter and spellsPotter: JSON files containing data for Harry Potter characters and spells, respectively. 
*/
// The next lines of code connect the application to a MongoDB database:
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

/*
mongoUrl: The URL of the MongoDB database to connect to. The process.env.MONGO_URL variable specifies the URL of the MongoDB database stored in an environment variable, or defaults to mongodb://127.0.0.1:27017/project-mongo if the environment variable is not defined.
mongoose.connect: Connects to the MongoDB database using the mongoUrl.
mongoose.Promise = Promise: Sets the global Promise library to the native JavaScript Promise library.
*/

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


/*
 port: The port number on which the server will run. The process.env.PORT variable specifies the port number stored in an environment variable,
or defaults to 8080 if the environment variable is not defined.
app: The instance of the Express application.
app.use(cors()): Adds middleware to enable CORS for all routes.
app.use(express.json()): Adds middleware to parse incoming requests with JSON payloads.
app.use((req, res, next) => {...}): Adds middleware to check if the database connection is ready before handling incoming requests. 
If the connection is not ready, it returns a 503 Service Unavailable error.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})
*/

// The next lines of code define the schemas for the Characters and Spells collections and create the corresponding models:
const { Schema } = mongoose;

const charactersSchema = new mongoose.Schema({
  "Character ID": Number,
  "Character Name": String,
  Species: String,
  Gender: String,
  House: String,
  Patronus: String,
  "Wand (Wood)": String,
  "Wand (Core)": String
});

const Characters = mongoose.model("Characters", charactersSchema);

const spellsSchema = new mongoose.Schema({
  "Spell ID": Number,
  Incantation: String,
  "Spell Name": String,
  Effect: String,
  Light: String
})

const Spells = mongoose.model("Spells", spellsSchema);
/*
In this section above, we are defining the schemas and models for our MongoDB collections using Mongoose.

First, we destructure the Schema object from mongoose using object destructuring.

Next, we define a new charactersSchema by creating a new instance of mongoose.Schema(). 
The schema specifies the structure of the documents that will be stored in the Characters collection. 
It defines the fields for each document, including their data types and any validation rules.

We define each field in the schema using a JSON object with the field name as the key and its data type as the value.
For example, the "Character Name" field has a data type of String. Additionally, 
we use the Number data type for the "Character ID" field.

After defining the schema, we create a Mongoose model for the Characters collection using mongoose.model(). 
The first argument is the name of the collection, which is "Characters" in our case. 
The second argument is the schema that defines the structure of the documents in the collection.

We also create a spellsSchema and a Mongoose model for the Spells collection in a similar fashion. 
This schema specifies the structure of the documents that will be stored in the Spells collection. 
The schema includes fields such as "Incantation", "Spell Name", and "Effect", with their respective data types.

These schemas and models will be used later in the code to perform *CRUD operations on the database.
*/

/*
In the code block below the schema definitions, there is a conditional block of code that checks for a RESET_DATABASE environment variable. 
If this variable is present, 
it will delete all data from the Characters and Spells collections in the MongoDB database, 
and then insert all the characters and spells from the characters.json and spells.json files into the respective collections. 
This is useful for resetting the database to a known state during development or testing.

if (process.env.RESET_DATABASE) {
  const resetDatabase = async () => {
    await Characters.deleteMany();
    await Spells.deleteMany();
    charactersPotter.forEach((singleCharacter) => {
      const newCharacter = new Characters(singleCharacter);
      newCharacter.save()
    });
    spellsPotter.forEach((singleSpell) => {
      const newSpell = new Spells(singleSpell)
      newSpell.save()
    })
  }
  resetDatabase();
}
*/


// Start defining your routes here
app.get("/", (req, res) => {
  const navigation = {
    guide: "Routes for Harry Potter API",
    Endpoints: [
      {
        "/characters": "Display all Characters from Harry Potter Movies",
        "/characters/ID/:ID": "Search specific Character id",
        "/characters/name/:name": "Search for a name in Harry Potter Movies",
        "/spells": "Display all spells"
      },
    ],
  };
  res.send(navigation);
});



app.get("/characters", async (req, res) => {
  try {
    res.json(charactersPotter)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/spells", async (req, res) => {
  try {
    res.json(spellsPotter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" })
  }
});


app.get("/characters/ID/:ID", async (req, res) => {
  try {
    const singleCharacter = await Characters.findOne({ "Character ID": req.params.ID });
    if (singleCharacter) {
      res.status(200).json({
        success: true,
        body: singleCharacter      
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Character not found"
        } 
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});


app.get("/characters/name/:name", async (req, res) => {
  try {
    const characters = await Characters.find({
      "Character Name": { $regex: req.params.name, $options: "i" }
    });
    if (characters.length === 0) {
      res.status(404).json({ message: "No characters found" });
    } else {
      res.json(characters);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
/*
There are four endpoint handlers defined using the app.get() function.

The first endpoint / returns a JSON object that describes the available endpoints of the API.

The second endpoint /characters returns all the characters from the characters.json file.

The third endpoint /spells returns all the spells from the spells.json file.

The fourth endpoint /characters/ID/:ID takes a parameter ID and returns a single character object from the database based on the ID. 
This endpoint makes use of the findById() method of the Characters model in order to fetch a single character from the MongoDB database.

The fifth endpoint /characters/name/:name takes a parameter name and returns an array of character objects from the database that match the provided name. 
This endpoint makes use of the $regex operator of MongoDB in order to perform a case-insensitive search for characters whose name contains the provided string.

Finally, the server is started using the app.listen() function, 
which listens for incoming HTTP requests on the specified port and logs a message to the console when the server is running.
*/

/* 
CRUD stands for Create, Read, Update, and Delete. 
These four basic operations represent the most fundamental functions performed on data in a database or storage system.

Create: Creating new data in the system
Read: Retrieving data from the system
Update: Modifying existing data in the system
Delete: Removing data from the system
These four operations are the building blocks of most database management systems and are essential for any application that needs to store, 
retrieve, and modify data. By providing these operations, an application can allow users to perform a wide variety of actions, 
from creating new entries to updating existing ones or removing them altogether.
*/