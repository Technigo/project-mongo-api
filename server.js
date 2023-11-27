// ------------ IMPORTS ------------ //
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const movieRoutes = require("./routes/movieRoute");

// ------------ VARIABLES ------------ //
// Defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

// ------------ MIDDLEWARE ------------ //
// Uses the imported routes in the app
app.use("/", movieRoutes);
// Middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
// Middleware to handle error if service is down
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status("503").json({ error: "Service unavailable" })
  }
})

// ------------ DATABASE CONNECTION ------------ //
// Connection to the database through Mongoose
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// ------------ SERVER START ------------ //
// Starts the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
