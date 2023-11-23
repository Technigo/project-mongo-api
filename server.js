import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import whlSites from "./data/whlSites.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/whlSites";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Site = mongoose.model("Site", {
  //Properties defined here match the keys from the whlSites.json file
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await whlSites.deleteMany({});

    data.forEach((siteData) => {
      new Site(siteData).save();
    });
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/names", async (req, res) => {
  const names = await Site.find();
  res.json(names);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
