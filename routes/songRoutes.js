// Importing necessary modules and dependencies
import express from "express";
import listEndpoints from "express-list-endpoints";
import { MetallicaSongModel } from "../models/MetallicaSongModel";

// Creating an instance of the Express router
const router = express.Router();

// ------- The routes -------

// ------- All endpoints -------
// Show all endpoints available in a JSON format
router.get("/", (req, res) => {
  const endpoints = listEndpoints(router);
  res.json(endpoints);
});

// ------- All Metallica songs -------
// Show all Metallica songs
router.get("/songs", async (req, res) => {
  // Asynchronously retrieve all Metallica songs from the database
  await MetallicaSongModel.find()
    // If the retrieval is successful, handle the result
    .then((result) => res.json(result))
    // If an error occurs during the retrieval, handle the error
    .catch((error) => res.json(error));
});

// ------- One Metallica song based on id -------
// Show a specific Metallica song based on its MongoDB-generated _id
router.get("/songs/:id", (req, res) => {
  const songId = req.params.id;

  // Find a specific song by its MongoDB-generated _id using the Mongoose model's findById method
  MetallicaSongModel.findById(songId)
    .then((song) => {
      // If the song is not found, send a 404 error response
      if (!song) {
        return res
          .status(404)
          .json({ message: "Song not found, please try another id" });
      }

      // Send the retrieved song as a JSON response
      res.json(song);
    })
    .catch((error) => {
      // If an error occurs during the database query, send an error response
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    });
});

// ------- One Metallica song based on title -------
// Show a specific Metallica song based on the song title (case-insensitive and partial match)
router.get("/song-name/:title", (req, res) => {
  const songTitle = req.params.title.toLowerCase(); // Convert to lowercase for case-insensitive search

  // Find a song by its title using the Mongoose model, allowing partial matches
  MetallicaSongModel.find({ name: { $regex: songTitle, $options: "i" } })
    .then((songs) => {
      // If no song titles are found, send a 404 error response
      if (!songs || songs.length === 0) {
        return res
          .status(404)
          .json({ message: "Song not found, please try another song title" });
      }

      // Send the retrieved song title(s) as a JSON response
      res.json(songs);
    })
    .catch((error) => {
      // If an error occurs during the database query, send an error response
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    });
});

// ------- One Metallica album -------
// Show a specific Metallica album based on the album title (case-insensitive and partial match). Also has the possibillity to check the popularity of the songs within an album with query param
router.get("/albums/:album", (req, res) => {
  const requestedAlbum = req.params.album.toLowerCase(); // Convert to lowercase for case-insensitive search
  const popularity = parseInt(req.query.popularity, 10); // Parse the 'popularity' query parameter as an integer

  // Find the album by title in the database
  MetallicaSongModel.find({ album: { $regex: requestedAlbum, $options: "i" } })
    .then((foundAlbum) => {
      // If no album found, send a 404 error response
      if (!foundAlbum || foundAlbum.length === 0) {
        return res
          .status(404)
          .json({ message: "Album not found, please try another album title" });
      }

      // If popularity query parameter exists and is valid, filter songs by popularity
      if (!isNaN(popularity) && popularity >= 0) {
        // Filter songs within the album by popularity
        const songsWithDesiredPopularity = foundAlbum.filter(
          (song) => song.popularity >= popularity
        );

        // If no songs match the popularity criterion, send an error response
        if (songsWithDesiredPopularity.length === 0) {
          return res.status(404).json({
            message:
              "No songs found with this popularity or more in this album",
          });
        }

        // Send the filtered songs within the album by popularity as a JSON response
        return res.json(songsWithDesiredPopularity);
      }
      // Send the retrieved album as a JSON response without filtering by popularity
      res.json(foundAlbum);
    })
    .catch((error) => {
      // If an error occurs during the database query, send an error response
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    });
});

// ------- Dummy endpoint -------
// Show all Metallica songs based on the year it was released
// router.get("/songs/release", async (req, res) => {
//   const releaseYear = req.query.release

//   try {
//     // Find a song by its release year using the Mongoose model, allowing partial matches
//     const songs = await MetallicaSongModel.find({
//       release_date: { $regex: "^${releaseYear}", $options: "i" },
//     });

//     // If no songs from that year is found, send a 404 error response
//     if (!songs || songs.length === 0) {
//       return res.status(404).json({
//         message:
//           "Song not found for the specified release year, please try another release year",
//       });
//     }

//     // Send the retrieved songs as a JSON response
//     res.json(songs);
//   } catch (error) {
//     // If an error occurs during the database query, send an error response
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// });

// Export the router for use in the main application
module.exports = router;
