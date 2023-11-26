import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nomineeRoutes from "./routes/nomineeRoutes";
import { NomineeModel } from "./models/Nominee";

dotenv.config();

import goldenGlobesData from "./data/golden-globes.json";

// Setting mongoUrl to be MONGO_URL if it exists, otherwise fall back on local host
const mongoUrl = process.env.MONGO_URL 
// Connecting to MongoDB
mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error conecting to MongoDB:", error.message);
    });
// Setting Mongoose Promise Library
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 3000;
const app = express();


// Add middlewares to enable cors and json body parsing
app.use(cors()); // Enable CORS (Cross-Origin Rescource Sharing)
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data

app.use("/", nomineeRoutes); // Route definitions

// Error handling for server state
app.use((req, res, next) => {
    if (mongoose.connection.readyState === 1) {
        next();
    } else {
        res.status(503).json({ error: "Service unavailable" });
    }
});

const Nominee = NomineeModel;

// This is how i seeded the database
const seedDatabase = async () => {
    try {
        await Nominee.deleteMany({});
          goldenGlobesData.forEach((nomineeData) => {
              new Nominee(nomineeData).save();
          });
          console.log("Database has been seeded");
    } catch (error) {
          console.error("Error resetting the database:", error.message)
    }
};
seedDatabase();


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

