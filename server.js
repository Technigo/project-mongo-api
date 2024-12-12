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
    await Elf.deleteMany({});
    
    const elves = [
      { elfID: 1, title: "Backend Dasher", name: "Eve", language_code: ["en"], reviews_count: 12 },
      { elfID: 2, title: "Frontend Prancer", name: "Bob", language_code: ["en", "sv"], reviews_count: 5 },
    ];

    await Promise.all(
      elves.map(async (elfData) => {
        const elf = new Elf(elfData);
        await elf.save();
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
