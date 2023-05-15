import express, { query } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import igData from './data/ig-noble.json';
import dotenv from 'dotenv';

dotenv.config();

// Adds list of all endpoints for GET '/'
const endpoints = require('express-list-endpoints');

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ig-noble-prize";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;

const prizeSchema = new Schema ({
  Year: Number,
  Subject: String,
  Description: String,
  References: []
});

const Prize = mongoose.model("Prize", prizeSchema);

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
   await Prize.deleteMany();
    igData.forEach((prize) => {
      const newPrize = new Prize(prize);
      newPrize.save();
      console.log(newPrize);
    });
  };
  resetDatabase();
};


// Welcome message
app.get('/', (req, res) => {
  const appEndpoints = endpoints(app);
  
  res.json({
    message: `IG Noble Prizes from 1991-2022. Search by subject (?subject='abc'), year or id.`,
    endpoints: appEndpoints
  });
});

// Full list of Ig Noble Prizes
app.get('/prizes', async (req, res) => {
  try {
    const prizeList = await Prize.find();

    if (prizeList.length > 0) {
      res.status(200).json({
        success: true,
        message: `Found ${prizeList.length} prizes`,
        body: {
          prizelist: prizeList,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No prizes found',
        body: {},
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e,
      body: {},
    });
  }
});

// Sorted by subject with query for case-insensitive subject searching (eg. 'bIO')
app.get('/subjects', async (req, res) => {
  const { subject } = req.query;
  const regexSubject = { $regex: subject, $options: 'i' };

  try {
    let subjectList;

    if (subject) {
      subjectList = await Prize.find({Subject: regexSubject}).sort('Subject');
    } else {
      subjectList = await Prize.find().sort('Subject');
    }

    if (subjectList.length > 0) {
      res.status(200).json({
        success: true,
        message: `Found ${subjectList.length} prizes with subject matching '${subject}'`,
        body: {
          subjectList: subjectList,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No prizes found with subject matching '${subject}'`,
        body: {},
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e,
      body: {},
    });
  }
});

// Get prize by year
app.get('/years/:year', async (req, res) => {
  const { year } = req.params;

  try {
    const yearList = await Prize.find({ Year: year });

    if (yearList.length > 0) {
      res.status(200).json({
        success: true,
        message: `Found ${yearList.length} prizes from year '${year}'`,
        body: {
          yearList: yearList,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No prizes found from year '${year}'. Please, make sure to provide a year between 1991-2022`,
        body: {},
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e,
      body: {},
    });
  }
});

// Prize by Id
app.get("/id/:id", async (req, res) => {
  const prizeId = req.params.id;

  try {
    // checks if id-input is incorrect! (eg. wrong lenght). Returns error 400 
    if (prizeId.length !== 24) {
      return res.status(400).json({
        success: false,
        body: {
          message: 'Invalid ID. Id should be 24 characters long',
        },
      });
    };
    
    const singlePrize = await Prize.findById(prizeId);
    // If the id.length is correct but not matched in database, returns 404.
    if (!singlePrize) {
      return res.status(404).json({
        success: false,
        body: {
          message: 'Prize not found',
        },
      });
    }
    // Successful response returns object
    res.status(200).json({
      success: true,
      body: singlePrize,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e,
      },
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
