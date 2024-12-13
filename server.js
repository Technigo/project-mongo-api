import express from "express";
import cors from "cors";
import mongoose from "mongoose";
//import elves from "./data/elves.json"
import expressListEndpoints from "express-list-endpoints";

/**
 * Connect to the MongoDB database using the URL from environment variables or default to localhost.
 * Mongoose uses JavaScript's built-in Promise system for handling asynchronous operations.
 */
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = Promise;

/**
 * Defined properties 
 * Properties defined to match the keys from the elves.json file
 */
const Elf = mongoose.model('Elf', {
  "elfID": Number,
  "title": String,
  "name": String,
  "language_code": [String],
  "reviews_count": Number
});

const port = process.env.PORT || 1224; //  Hoho! 
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((request, response, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    response.status(503).json({ error: "Service unavailable" })
  }
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    console.log("Starting to seed the database...");
    await Elf.deleteMany({});
    console.log("Old data cleared!");

    const elves = [
      { elfID: 1, title: "Backend Dasher", name: "Eve", language_code: ["en"], reviews_count: 12 },
      { elfID: 2, title: "Frontend Prancer", name: "Bob", language_code: ["en", "sv"], reviews_count: 5 },
    ];

    await Promise.all(
      elves.map(async (elfData) => {
        const elf = new Elf(elfData);
        await elf.save();
        console.log(`Saved elf: ${JSON.stringify(elf)}`);
      })
    );

    console.log("Database has been seeded!");
  };
  seedDatabase();
}

// Documentation endpoint
app.get("/", (request, response) => {
  const endpoints = expressListEndpoints(app);
  response.json({
    message: "Welcome to the Elves API! Here are the available endpoints:",
    description: {
      "/elves/all": "Get all elves",
      "/elves/top-twelves": "Get the top twelves",
      "/elves/titles/:title": "Get elves by title",
      "/elves/:id": "Get a specific elf by ID",
      "/test": "Test endpoint",
    },
    endpoints: endpoints
  });
});

/**
 * Endpoint for getting all elves.
 * This endpoint returns the complete list of elves from the elves database.
 */
app.get("/elves/all", async (request, response) => {
  try {
    const elves = await Elf.find(); 
    response.json(elves);
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch elves" });
  }
});
/**
 * Endpoint to get the top 12 elves, the "TwElves"
 * This endpoint uses .slice() to return the first 12 elves from the elves database.
 */
app.get("/elves/top-twelves", async (request, response) => {
  try {
    const elves = await Eld.find().limit(12);
    response.json(elves);
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch the Top TwElves" });
  }
});

/**
 * Endpoint for getting elves based on the provided title. 
 * This endpoint uses .filter() to return the elves with a matching title
 */
app.get("/elves/titles/:title", (request, response) => {
  const title = request.params.title.toLowerCase();
  const filteredElves = elves.filter((elf) => elf.title.toLowerCase() === title);

  // Return elves with titles that match
  response.json(filteredElves);
});

/**
 * Endpoint for getting elves based on a unique ID. 
 * This endpoint uses .find() to search for the elf in the elves database. 
 * If an elf with the given ID exists, it returns the elf's data with a 200 status.
 * If no elf is found, it returns with a 404 status and the message: "404 - No elf found with that ID".
 */

app.get("/elves/:id", (request, response) => {
  const id = request.params.id;

  const elf = elves.find((record) => record.elfID === +id);
  if (elf) {
    response.status(200).json(elf);
  } else {
    response.status(404).send("404 - No elf found with that ID");
  }
})

/**
 * Endpoint for testing the server.
 * This endpoint confirms that the server is running and responds with "Jingle bells, the server tells, it's up and running well!"
 */
app.get("/test", (request, response) => {
  response.send("Jingle bells, the server tells, it's up and running well!");
  console.log("Jingle bells, the server tells, it's up and running well!");
});

/**
 * Start the server.
 * The server listens on the specified port and logs the URL to the console.
 */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
