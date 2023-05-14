import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import CountriesData from "./data/countries.json"

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

const countrySchema = new Schema({
    Country: String,
    Human_development: String,
    GII: Number,
    Rank: Number,
    Maternal_mortality: Number,
    Adolescent_birth_rate: Number,
    Seats_parliament: Number,
    F_secondary_educ: Number,
    M_secondary_educ: Number,
    F_Labour_force: Number,
    M_Labour_force: Number

}, { versionKey: false });

const Country = mongoose.model("Country", countrySchema);

if (process.env.RESET_DB) {
      const resetDatabase = async () => { 
        await Country.deleteMany(); 

        // StudentData.forEach((singleStudent) => { 
        //   const newStudent = new Student(singleStudent); 
        //   newStudent.save()
        CountriesData.forEach((singleCountry) => { 
            new Country(singleCountry).save()
        })
      } 
      resetDatabase();
    }
    

// Start defining your routes here
app.get("/", (req, res) => {
    res.json(listEndpoints(app))
});

// route to fetch all students http://localhost:8080/students

app.get("/countries", async (req, res) => {
    const countries = await Country.find()

    // console.log(countries, "countries")

    res.json(countries);
})

// app.get("/countries", async (req, res) => {
//     const { F_secondary_educ } = req.query;
//     const response = {
//         success: true,
//         body: {}
//     }
//     const F_secondary_educQuery = { $gte: F_secondary_educ  ? F_secondary_educ : 0 };

//     try {
//         response.body = await Country.find({F_secondary_educ: F_secondary_educQuery})

//         if (true) {
//             res.status(200).json(response)
//         } else {
//             res.status(404).json({
//                 success: false,
//                 body: {
//                     message: "No countries found"
//                 }
//             })
//         }
//     } catch(e) {
//         res.status(500).json(response)
//     }
// })

// route to fetch one single student ID http://localhost:8080/students/id/645e0ec3abe30d48033fcfeb
app.get("/countries/id/:id", async (req, res) => {
    try {
        const singleCountry = await Country.findById(req.params.id);
        if (singleCountry) {
            res.status(200).json({
                success: true,
                body: singleCountry
            })
        } else {
            res.status(404).json({
                success: false,
                body: {
                    message: "Country not found"
                }
            })
        }
    } catch(e) {
        res.status(500).json({
            success: false,
            body: {
                message: e.message
            }
        })
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});