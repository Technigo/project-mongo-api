import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// import dotenv from "dotenv"
import tedTalkData from "./data/ted-talksMod.json";

// dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


// Create a Model
const TedTalk = mongoose.model('TedTalk', {
    "talk_id": Number,
    "title": String,
    "speaker": String,
    "recorded_date": String,
    "published_date": String,
    "event": String,
    "duration": Number,
    "views": Number,
    "likes": Number
})

// SeedDataBase
if (process.env.RESET_DB) {
  // console.log('Resetting database!')
  
  	const seedDataBase = async () => {
      // All Models
      await TedTalk.deleteMany({});
  		tedTalkData.forEach((singleTedTalk) => {
  			const newTedTalk = new TedTalk(singleTedTalk)
        newTedTalk.save()
  		})
     
    }
  
    seedDataBase()
  }

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// Middleware set up for error msg like DB down.
// This will execute first, if server is down => error msg, won't execute futher.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
}) 


// -------All Routes start here------------

// Route 1 show introductions to endpoints
app.get("/", (req, res) => {
  res.send({
    responseMassage: "Hello Everybody and welcome!",
    guide: "These are the routes for this TED Talk API!",
    Endpoints:"",
    Routes:[{
        "/allTedTalks": "All TED Talks",
        "/top5Views": "Top 5 most viewd TED Talks",
        "/speakers/:speaker": "Search speaker with RegExpTED and watch all TED Talks from named speaker", 
        "/event/:event": "Serch by event, and get a list of TED Talks",
        "/tedTalk/id/:id": "search for a TED Talk with _Id (ex. 638271655ec3bb12878ae9b8)",
        "/tedTalk/talk_id/:talk_id": "search for a TED Talk with talk_Id (ex. 248)",
      }],
  });
});

// Route 2 - List of all TED Talks (array of elements)
app.get("/allTedTalks", async (req, res) => {
  // res.status(200).json(tedTalkData); 
  const allTedTalks = await TedTalk.find({});
    res.status(200).json({
      success: true,
      body: allTedTalks
    });
});

// Route 3 Returns top 5 most viewed TED Talks
app.get("/top5Views", async (req, res) => {
  try {
    const mostViews = await TedTalk.find({}).sort({views: -1}).limit(5)
    if (mostViews) {
      res.status(200).json({
        success: true,
        body: mostViews
      });
    }
  } catch(error){
    res.status(400).json({
      body: {
        message: "bad request",
        success: false
    }})
  }
});

// Route 4 find TED talks by speaker
// The RegExp with "i" makes it possible to search 
// by any charecter, so you vill accualy never get status(404).
app.get("/speaker/:speaker", async (req, res) => {
try{
  const speakersTalks = await TedTalk.find({ speaker: new RegExp(req.params.speaker, "i") })
  if (speakersTalks) {
    res.status(200).json({
    success: true,
    tedTalkData: speakersTalks
  })
  // } else {
  //   res.status(404).json({
  //     success: false,
  //     status_code: 404,
  //     error: `No speaker with this name ${req.params.speaker} was found, try another`
  //   })
  }
} catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid name"
      }
    });
}
});

// Route 5 find TED talks by event
// The RegExp with "i" makes it possible to search 
// by any charecter, so you vill accualy never get status(404).

app.get("/event/:event", async (req, res) => {
  try{
    const eventTalks = await TedTalk.find({ event: new RegExp(req.params.event, "i") })
    if (eventTalks) {
      res.status(200).json({
      success: true,
      tedTalkData: eventTalks
    })
    // } else {
    //   res.status(404).json({
    //     success: false,
    //     status_code: 404,
    //     error: `No event with this name ${req.params.event} was found, try another`
    //   })
    }
  } catch (error) {
      res.status(400).json({
        success: false,
        body: {
          message: "Invalid input"
        }
      });
  }
  });

// ROUTE 6: Filter on a specific TED Talk with id.
 // req.params.id refers to given _id
app.get("/tedTalk/id/:id", async (req, res) => {
  try {
    const singleTedTalk = await TedTalk.findById(req.params.id);
     
    if (singleTedTalk) {
      res.status(200).json({
        success: true,
        body: singleTedTalk
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: `No TED Talk whit this id ${req.params.id}, please try again`
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }
  
});

// ROUTE 7: Filter on a specific TED Talk with talk_id.
app.get("/tedTalk/talk_id/:talk_id", async (req, res) => {
  try {
    const oneTedTalk = await TedTalk.find({talk_id: req.params.talk_id});
     
    if (oneTedTalk) {
      res.status(200).json({
        success: true,
        body: oneTedTalk
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: `No TED Talk whit this talk_id ${req.params.talk_id}, please try again`
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
