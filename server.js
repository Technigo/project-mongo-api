import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import anime from "./data/anime.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/anime";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Anime = mongoose.model("Anime",
{
  id: Number,
  title: String,
  synonyms: String,
  japanese: String,
  english: String,
  synopsis: String,
  type: String,
  episodes: Number,
  status: String,
  start_Aired: String,
  end_Aired: String,
  premiered: String,
  broadcast: String,
  producers: String,
  licensors: String,
  studios: String,
  source: String,
  genres: String,
  themes: String,
  demographics: String,
  duration_Minutes: Number,
  rating: String,
  score: Number,
  scored_Users: Number,
  ranked: Number,
  popularity: Number,
  members: Number,
  favorites: Number
}
)

if(process.env.RESET_DB){
  const resetDataBase = async () => {
    await Anime.deleteMany();
    anime.forEach(singleAnime => {
      const newAnime = new Anime(singleAnime);
      newAnime.save()
    })
  }
  resetDataBase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send([
    {"/": "Anime Playground"},
    {"/animes": "Display all animes"},
    {"/animes?status={status}": "Display all animes that has the same status"},
    {"/animes/id/:id": "Display one anime by id number comes from JSON data"},
    {"animes/:id": "Display one anime by _id number comes from mongoDB"},
    {"/animes/japanesetitle/:japanese": "One anime title displayed for Japan"},
    {"/animes/title/:english": "One anime title displayed for other countries than Japan"},
    {"/highscore": "Sorting anime by score"},
    {"/animes/type/:type": "Find anime with specific type"},
    {"/animes/studios/:studio": "Find anime with specific studio producer"},
    {"/animes/studios/:studio?premiered={premiered}": "Find anime with specific studio producer and then can filter more depending on when it is premiered"}
  ]);
});

// Display all animes but only return some data such as the title, japanese title, synopsis, score, type, studio, and status. Also it is sorted from the highest score
// Can also filter more by adding query for status
// example https://project-mongo-api-thr246hagq-lz.a.run.app/animes -> to show all animes
// example https://project-mongo-api-thr246hagq-lz.a.run.app/animes?status=currently%20airing -> to filter animes by specific status 
app.get("/animes", async (req, res) => {
  const statusRegex = new RegExp(req.query.status, "i")
  const animes = await Anime.find({
    status: statusRegex
  }).sort({score: -1}).select({title: 1, japanese: 1, synopsis: 1, score: 1, type: 1, studios: 1, status: 1, id: 1})
  
  if(animes.length !== 0){
    res.json({
      data: animes,
      success: true
    })
  } else {
    res.status(404).json({
      success: false,
        body: {
          message: "(404) Animes not found"
    }})
  }
})

// Display one anime by id number comes from dataset
// Chose to do findOne() for this part instead of findById because I don't have ObjectId _id in my dataset
// example https://project-mongo-api-thr246hagq-lz.a.run.app/animes/id/33255
app.get("/animes/id/:id", async (req, res) => {
  try{
    const id = Number(req.params.id)
    const singleAnime = await Anime.findOne({id: id});
    if (singleAnime.length !== 0) {
      res.status(200).json({
        success: true,
        data: singleAnime,
      });
    } else {
      res.status(404).json({
        success: false,
        data: {
          message: "(404) ID not found",
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      data: {
        message: "Invalid ID"
      }
    });
  } 
});

// Display one anime by _id number
// Now I can findById() to get id provided by mongoDB
// To see this _id, please go to /anime route first and choose any _id instead of id
// example https://project-mongo-api-thr246hagq-lz.a.run.app/animes/6380b672d0800c5e066e77ad
app.get("/animes/:id", async (req, res) => {
  try{
    const animeId = await Anime.findById(req.params.id)

  if(animeId){
    res.status(200).json({
      data: animeId,
      success: true,
    })
} else {
    res.status(404).send({
      data: "(404) ID not found",
      success: false 
    }
    )}
} catch(error){
  res.status(400).json({
    success: false,
    body: {
      message: "bad request"
  }})
}})

// Display one anime by the japanese title
// example https://project-mongo-api-thr246hagq-lz.a.run.app/animes/japanesetitle/銀魂
app.get("/animes/japanesetitle/:japanese", async (req, res) => {
  try{
    const japaneseTitleRegex = new RegExp(req.params.japanese, "i");
    const animeJapaneseTitle = await Anime.findOne({ japanese: japaneseTitleRegex })

  if(animeJapaneseTitle){
    res.status(200).json({
      data: animeJapaneseTitle,
      success: true,
    })
} else {
    res.status(404).send({
      data: "(404) Title not found",
      success: false 
    }
    )}
} catch(error){
  res.status(400).json({
    success: false,
    body: {
      message: "bad request"
  }})
}})

// Display one anime by the title for worldwide release
// example https://project-mongo-api-thr246hagq-lz.a.run.app/animes/title/naruto%20shippuuden
app.get("/animes/title/:english", async (req, res) => {
  try{
    const titleRegex = new RegExp(req.params.english, "i");
    const animeTitle = await Anime.findOne({ english: titleRegex })

  if(animeTitle){
    res.status(200).json({
      data: animeTitle,
      success: true,
    })
} else {
    res.status(404).send({
      data: "(404) Title not found",
      success: false 
    }
    )}
} catch(error){
  res.status(400).json({
    success: false,
    body: {
      message: "bad request"
  }})
}})

// Display all animes that scores 8 or higher
// example https://project-mongo-api-thr246hagq-lz.a.run.app/highscore
app.get("/highscore", async (req, res) => {
  try{
    const animeScore = await Anime.find({score: { $gte: 8 }
    }).sort({score: -1})
    res.status(200).send({
      data: animeScore,
      success: true
  })
  } catch(error){
    res.status(400).json({
      body: {
        message: "bad request",
        success: false
    }})
  }
})

// Display all animes based on its type and sorted from the best score
// example https://project-mongo-api-thr246hagq-lz.a.run.app/animes/type/movie
app.get("/animes/type/:type", async (req, res) => {
 try{
  const typeRegex = new RegExp(req.params.type, "i");
  const animeType = await Anime.find({ type: typeRegex }).sort({score: -1})

  if(animeType.length !== 0){
    res.status(200).json({
      data: animeType,
      success: true,
  })
} else{
    res.status(404).json({
      success: false,
      body: {
        message: "(404) Type not found"
      }
    })
  } 
} catch(error){
  res.status(400).json({
    success: false,
    body: {
      message: "bad request"
  }})
} 
})

// Display all animes that are made by the same studio and later on can be filtered more by the time it's premiered.
// So, the example below means: animes that were made by Madhouse studio & premiered in Fall 2015 (but even if the premiered time is omitted it should still work fine & show only animes from that specific studio)
// example https://project-mongo-api-thr246hagq-lz.a.run.app/animes/studios/madhouse?premiered=fall%202015
app.get("/animes/studios/:studios", async (req, res) => {
  try{
    const studioRegex = new RegExp(req.params.studios, "i");
    const premieredRegex = new RegExp(req.query.premiered, "i")
    const animeStudio = await Anime.find({ 
      studios: studioRegex,
      premiered: premieredRegex
  })
    
  if(animeStudio.length !== 0){
      res.json({
        data: animeStudio,
        success: true,
      })
  } else {
      res.status(404).json({
        success: false,
        body: {
          message: "(404) Details not found"
        }})
      }
    } catch(error){
      res.status(400).json({
        success: false,
        body: {
          message: "bad request"
      }})
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
