import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
//import { MetallicaSongModel } from "./models/MetallicaSongModel";
//import MetallicaSongs from "./data/MetallicaSongs.json"
import songRoutes from "./routes/songRoutes"
//const songRoutes = require("./routes/songRoutes");
dotenv.config() //Load environment variables from the .env file

// If you're using one of our datasets, uncomment the appropriate import below to get started!
// import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Imported routes in the app
app.use(songRoutes);
// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })) // Parse URL-encoded data
//Ha med??
// app.use((req, res, next) => {
//   if (mongoose.connection.readyState === 1) {
//     next();
//   } else {
//     res.status("503").json({ error: "Service unavailable" })
//   }
// })

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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
