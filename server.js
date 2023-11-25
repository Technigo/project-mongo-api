import mongoose from "mongoose";

const app = require("./app");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoUrl =
  process.env.MONGO_URL.replace("<PASSWORD>", process.env.DATABASE_PASSWORD) ||
  "mongodb://localhost:27017/project-mongo";

mongoose.set("strictQuery", false);
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((con) => console.log("connected"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
