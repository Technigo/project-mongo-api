import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import elves from "./data/elves.json";
import expressListEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 1224; //  Hoho! 
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Elf = mongoose.model('Elf', {
  // Properties defined here match the keys from the elves.json file
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Elf.deleteMany({})

    elves.forEach((elfData) => {
      new Elf(elfData).save()
    })
  }
  seedDatabase()
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
    endpoints: endpoints
    }
  });
/**
 * Endpoint for getting all elves.
 * This endpoint returns the complete list of elves from the elves.json.
 */
  app.get("/elves/all", (request, response) => {
  
    // Return all elves
    response.json(elves);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
