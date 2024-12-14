import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";
import cats from "./data/cats.json";

dotenv.config(); // Load environment variables from env. file

// Check if MongoDB string is provided in env. file
if (!process.env.MONGO_URL) {
  console.error("Error: MONGO_URL is not defined in the .env file.");
  process.exit(1); // Stop the app if MONGO_URL is not defined
} else {
  console.log("Mongo URL loaded successfully!");
}

// Connect to Mongo Atlas using connection string from env. file
const mongoUrl = process.env.MONGO_URL;

mongoose
  .connect(mongoUrl)

  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit if connection fails
  });

//Define mongoose model for cat
const Cat = mongoose.model("Cat", {
  id: Number,
  breed: String,
  fur_length: String,
  fur_color: String,
  personality: String,
  eye_color: String,
  commonality: String,
});

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const port = process.env.PORT || 8080;
const app = express();

//Seed database
if (process.env.RESET_DATABASE) {
  console.log("Resetting database!");

  const seedDatabase = async () => {
    await Cat.deleteMany({}); //Deletes all documents in the 'Cat' collection
    cats.forEach((cat) => {
      // Iterates over the 'data' array
      newCat(cat).save(); // Creates a new Cat document for each item in 'data' and saves it
    });
  };
  seedDatabase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//Defining routes

// Start route
app.get("/", (request, response) => {
  const endpoints = listEndpoints(app); // Fetch all available routes
  response.json({
    message:
      "Miao Miao! Welcome to the Cats Mongo API!  Here you can find all types of cats. Below are the available endpoints",
    endpoints: endpoints, // Send the list of endpoints as JSON
  });
});

app.get("/cats", async (request, response) => {
  const { personality, fur_length, commonality, breed } = request.query;

  // query object based on the parameters
  const query = {};
  if (personality) query.personality = personality;
  if (fur_length) query.fur_length = fur_length;
  if (commonality) query.commonality = commonality;
  if (breed) query.breed = breed;

  try {
    // Query MongoDB using the 'Cat' model based on the query parameters
    const filteredCats = await Cat.find(query);

    if (filteredCats.length > 0) {
      response.json(filteredCats); // Return matching cats
    } else {
      response.status(404).send("No cats found with the specified criteria");
    }
  } catch (error) {
    console.error("Error fetching cats:", error);
    response.status(500).send("Server error occurred");
  }
});

app.get("/cats/:id", async (request, response) => {
  const id = request.params.id; // Get the id from the URL parameter

  try {
    // Query MongoDB for the cat with the given custom 'id' field
    const cat = await Cat.findOne({ id }); // Match the custom 'id' field

    if (cat) {
      response.json(cat); // Return the cat object if found
    } else {
      response.status(404).send("Cat not found with the specified id"); // If no cat found with this id
    }
  } catch (error) {
    console.error("Error fetching cat by ID:", error);
    response.status(500).send("Server error occurred");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
