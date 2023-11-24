// Importing required modules and dependencies
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv" // Import dotenv for environment variables
//import MetallicaSongs from "./data/MetallicaSongs.json"
import songRoutes from "./routes/songRoutes" // Import routes for handling song-related endpoints
//const songRoutes = require("./routes/songRoutes");

dotenv.config() //Load environment variables from the .env file

// Connection to MongoDB using environment variable for URL
const mongoUrl = process.env.MONGO_URL
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
const port = process.env.PORT || 8080;
const app = express();

// Imported routes in the app
app.use(songRoutes); // Mounting song-related routes in the Express app

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: false })) // Parse URL-encoded data

// Conditional database seeding based on environment variable, commented out since data is in MongoDB Compass
// if (process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     try {
//       console.log('Seeding database...');
//     await MetallicaSongModel.deleteMany({})
// await MetallicaSongModel.insertMany(MetallicaSongs);
//             console.log("Database seeded successfully!");
//         } catch (error) {
//             console.error("Error seeding database:", error);
//     }
//   }

//   seedDatabase()
//  } else {
//    console.log('RESET_DB is not true. Database will not be reset.');
//  }

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
