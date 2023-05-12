import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import StudentData from "./data/students.json"

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

if (process.env.RESET_DB) {
      const resetDatabase = async () => { 
        await Student.deleteMany(); 

        // StudentData.forEach((singleStudent) => { 
        //   const newStudent = new Student(singleStudent); 
        //   newStudent.save()
        StudentData.forEach((singleStudent) => { 
            new Student(singleStudent).save()
        })
      } 
      resetDatabase();
    }
    

// Start defining your routes here
app.get("/", (req, res) => {
    res.json(listEndpoints(app))
});

// route to fetch all students http://localhost:8080/students

app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
})

// app.get("/students", async (req, res) => {
//     const { gender } = req.query;
//     const response = {
//         success: true,
//         body: {}
//     }
//     const readingScore = Number(reading_score);
//     const reading_scoreQuery = { $gte: reading_score ? reading_score : 0 };

//     try {
//         response.body = await Student.find({gender: gender, reading_score: reading_scoreQuery})
//         response.body = await Student.find({gender: gender})

//         if (response.body.length > 0) {
//             res.status(200).json(response)
//         } else {
//             res.status(404).json({
//                 success: false,
//                 body: {
//                     message: "No students found"
//                 }
//             })
//         }
//     } catch(e) {
//         res.status(500).json(response)
//     }
// })

// route to fetch one single student ID http://localhost:8080/students/id/645e0ec3abe30d48033fcfeb
app.get("/students/id/:id", async (req, res) => {
    try {
        const singleStudent = await Student.findById(req.params.id);
        if (singleStudent) {
            res.status(200).json({
                success: true,
                body: singleStudent
            })
        } else {
            res.status(404).json({
                success: false,
                body: {
                    message: "Student not found"
                }
            })
        }
    } catch(e) {
        res.status(500).json({
            success: false,
            body: {
                message: e
            }
        })
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});