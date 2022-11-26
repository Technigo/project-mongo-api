import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// import dotenv from "dotenv"
import tedTalkData from "./data/ted-talksMod.json";

// dotenv.config()


// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

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
  console.log('Resetting database!')
  
  	const seedDataBase = async () => {
      // All Models
      await TedTalk.deleteMany();
      // await TedTalk.deleteMany({})
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
// set up a middleware for error msg like DB down
// this will start first before my routs, execute first.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
}) 


// Start defining your routes here
// Route 1 show introductions to endpoints
app.get("/", (req, res) => {
  res.send("Hello Everybody and welcome!");
  // TedTalk.find().then(tedTalks => {
  //   res.json(tedTalkData)
  // })
});

// Route # - List of all TED Talks (array of elements)
app.get("/allTedTalks", async (req, res) => {
  // res.status(200).json(tedTalkData); 
  const allTedTalks = await TedTalk.find({});
    res.status(200).json({
      success: true,
      body: allTedTalks
    });
    console.log(tedTalkData.length)
});

// ROUTE #: Filter on a specific TED TAlk with id.
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

app.get("/talks/", async (req, res) => {

  const {event, speaker, views} = req.query;
  const response = {
    success: true,
    body: {}
  }
  const matchAllRegex = new RegExp(".*");
  const eventQuery = event ? event : matchAllRegex;
  const speakerQuery = speaker ?speaker : matchAllRegex;
  const viewsQuery = views ? views : {$gt:0, $lt:3000000};

  try {
    // if ( req.params.genre && req.params.danceability) {
      response.body = await TedTalk.find({event: eventQuery,speaker: speakerQuery, views: viewsQuery}).limit(5)
      // response.body = await TedTalk.find({event: speakerQuery,speaker: speakerQuery, views: viewsQuery}).limit(2).sort({energy: 1}).select({trackName: 1, artistName: 1})
      //.exec() => to explore if you're curious enough :P
    // } else if (req.params.genre && !req.params.danceability) {
    //   response.body = await Song.find({genre: req.params.genre});
    // } else if (!req.params.genre && req.params.danceability) {
    //   response.body = await Song.find({danceability: req.params.danceability});
    // }
    res.status(200).json({
      success: true,
      body: response
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: error
      }
    });
  }

});



// :name, is case sensetive need to be exact
// app.get('/:speaker', (req, res) => {
//   TedTalk.findOne({speaker: req.params.speaker}).then(talkSpeaker => {
//     if(talkSpeaker) {
//       res.json(talkSpeaker)
//     } else {
//       res.status(404).json({ error: 'Speaker not found, try again'})
//     }
//   })
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
