import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import topMusicData from "./data/top-music.json";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.eilze2r.mongodb.net/project-mongo-api?retryWrites=true&w=majority`
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const Song = mongoose.model("Song", {
  id: Number,
  trackName: String,
  artistName: String,
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
});


if(process.env.RESET_DB) {
	//Database seeding is populating a database with an initial set of data. It's common to load seed data such as initial user accounts or dummy data upon initial setup of an application.
  const seedDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
			//Here Refrencing our variable Song. newSong will be equal to new Song 
   // new Song will accept an argument 
      const newSong = new Song (singleSong)
			newSong.save()
    })
  }
	   //Invoke the seedDatabase
  seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send({Message:"Top-Music API", data: listEndpoints(app)});
});

app.get("/allSongs", async (req, res) => {
	//assign to a variable. all songs would be equal to await song.find()
		//find() takes an argument/all songs that have an object
	const allSongs= await Song.find({});
	res.status(200).json({
		succes: true,
	body: allSongs})
})

app.get("/songs/id/:id", async (req, res) => {
	//always use try and catch to catch the errors in server
	try{
	//req take params which have id
	const singleSong = await Song.findById(req.params.id);
	if (singleSong) {
		res.status(200).json({
			success: true,
			body: singleSong
		});
	} else {
		res.status(404).json({
			success: false,
			body: {
				message: "Could not find the song"
			}
		});
	}
} catch(error){
	res.status(400).json({
		success: false,
		body: {
			message: "Invalid id"
		}
	});
}
})
app.get("/songsquery/", async (req, res) => {
  const { danceability, genre, } = req.query;
  const response = {
    succes: true,
    body: {}
  }
  //if genre property is present you will assig a specific genre property then else will regular expression present
	//otherwise you will allow too much genre that is there
  const matchAllRegex = new RegExp(".*");
  const matchAllNumbersGreaterThanZero = { $gt: 0, $lt: 100 };

  const genreQuery = genre ? genre : matchAllRegex;
  const danceabilityQuery = danceability ? danceability : matchAllNumbersGreaterThanZero;
  try {
   response.body = await Song.find({ danceability: danceabilityQuery, genre: genreQuery }).limit(3) 
	 //.sort({energy: 1}).select({trackName:1, artistName: 1});

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

//Long solution
    // if ( req.params.genre && req.params.danceability) {
			// response.body = await Song.find({genre: genreQuery, danceability: danceabilityQuery});
			// response.body = await Song.find({genre: genreQuery, danceability: danceabilityQuery}).limit(2).sort({energy: 1}).select({trackName:1, artistName: 1});
			  //.exec() => to explore if you're curious enough :P
    //   response.body = await Song.find({genre: req.params.genre, danceability: req.params.danceability});
    // } else if (req.params.genre && !req.params.danceability) {
    //   response.body = await Song.find({genre: req.params.genre});
    // } else if (!req.params.genre && req.params.danceability){
    //   response.body = await Song.find({danceability: req.params.danceability});
    // }

//regular expression
//https://regex101.com/
// https://mongoosejs.com/docs/queries
// /yourWordOfChoice/gm - regex to match yourWordOfChoice
// /.*/gm - regex to match every character in a string

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
