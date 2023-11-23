import mongoose from "mongoose";

const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: "./.env" });

// import data from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/project-mongo";

mongoose.set("strictQuery", false);
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((con) => console.log("connected"));

const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
