import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { Restaurant } from "./models/Restaurant";
const { errorHandler } = require("./middlewear/errorMiddlewear");

const dotenv = require("dotenv").config();

connectDB();

const app = express();

const port = process.env.PORT || 8080;

if (process.env.RESET_DB) {
  const resetDb = async () => {
    await Restaurant.deleteMany({});
  };
  resetDb();
}

const newRestaurant = new Restaurant({
  name: "Walrusy",
  area: "Capitol Hill",
  stars: 4,
  stars_count: 1342,
  price: "$$",
  area: "Ballard",
  Category: ["Seafood", "Date night"],
});

newRestaurant.save();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.use("/api/goals", require("./routes/goalRoutes").default);
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
