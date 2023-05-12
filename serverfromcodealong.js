// import express, { response } from "express";
// import cors from "cors";
// import mongoose, { SchemaType } from "mongoose";

// // If you're using one of our datasets, uncomment the appropriate import below
// // to get started!
// // import avocadoSalesData from "./data/avocado-sales.json";
// // import booksData from "./data/books.json";
// // import goldenGlobesData from "./data/golden-globes.json";
// // import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = Promise;

// // Defines the port the app will run on. Defaults to 8080, but can be overridden
// // when starting the server. Example command to overwrite PORT env variable value:
// // PORT=9000 npm start
// const port = process.env.PORT || 8080;
// const app = express();

// // Add middlewares to enable cors and json body parsing
// app.use(cors());
// app.use(express.json());

// const { Schema } = mongoose;
// // const userSchema = new Schema ({
// //   name: String,
// //   age: Number,
// //   alive: Boolean
// // });

// // const User = mongoose.model("User", userSchema);
// const songSchema = new Schema({
//   id: Number,
//   trackName: String,
//   artistName: String,
//   genre: String,
//   bpm: Number,
//   energy: Number,
//   danceability: Number,
//   loudness: Number,
//   liveness: Number,
//   valence: Number,
//   length: Number,
//   acousticness: Number,
//   speechiness: Number,
//   popularity: Number
// })

// const Song = mongoose.model("Song", songSchema);


// if (process.env.RESET_DB) {
//   const resetDatabase = async () => { // with async, comes await = before anything else happens, wait for all songs to be deleted
//     await Song.deleteMany(); // make sure no duplicates - deletes everything
//     topMusicData.forEach((singleSong) => { // populates the json data //
//       const newSong = new Song(singleSong); // 
//       newSong.save() // These three lines // can't do if manually import jSON
//     })
//   } 
//   resetDatabase();
//   // call a function while declaring it
// }

// // RESET_DB=true npm run dev 

// // Start defining your routes here
// app.get("/", (req, res) => {
//   res.send("Hello Technigo!");
// });

// app.get("/songs", async (req, res) => {
//   const { genre, danceability } = req.query;
//   const response = {
//     success: true,
//     body: {}
//   }
//   const genreRegex = new RegExp(genre) // Regular expression, works for STRINGS
//   const danceabilityQuery = { $gt: danceability ? danceability : 0 }; //gt - greater than the one provided
//   // adding the ternary operator gets /songs to work now 
//   try {
//     // const searchResultFromDB= await Song.find({genre: genreRegex, danceability: danceabilityQuery})
//     // if (searchResultFromDB) {
//     //   response.body = searchResultFromDB
//     //   res.status(200).json(response)
//     // } else {
//     //   response.success = false,
//     //   res.status(500).json(response)
//     // } catch(e) {
//     // response.success = false,
//     //   res.status(500).json(response)
//     // }
//     response.body = await Song.find({genre: genreRegex, danceability: danceabilityQuery}) // now 'pop' includes 'canadian pop' etc 
//     if (true) {
//       res.status(200).json(response)
    
//     } else {
//       res.status(404).json({
//         success: false,
//         body: {
//           message: "Song not found"
//         }
//       })
//       } 
//     } catch(e) {
//         res.status(500).json(response)
//       }
// });



// app.get("/songs/id/:id", async (req, res) => {
//   try {
//     const singleSong = await Song.findById(req.params.id);
//     if (singleSong) {
//       res.status(200).json({
//         success: true,
//         body: singleSong
//       })
//     } else {
//       res.status(404).json({
//         success: false,
//         body: {
//           message: "Song not found"
//         }
//       })
//     }
//   } catch(e) {
//     res.status(500).json({
//       success: false,
//       body: {
//         message: e
//       }
//   })
// }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });