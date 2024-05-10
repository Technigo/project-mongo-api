import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/Routes.js";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 7777;
const app = express();
app.use("/", router);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
