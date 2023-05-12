import express from "express";
import cors from "cors";
import mongoose from "mongoose";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
const listEndpoints = require("express-list-endpoints")

const { Schema } = mongoose;

const studentSchema = new Schema({
 gender: String,
 race_ethnicity: String,
 parental_level_of_education: String, 
 lunch: String,
 test_preparation_course: String, 
 math_score: Number, 
 reading_score: Number,
 writing_score: Number
})

const Student = mongoose.model("Student", studentSchema);

// Start defining your routes here
app.get("/", (req, res) => {
    res.json(listEndpoints(app))
});

app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});