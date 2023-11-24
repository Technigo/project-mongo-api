// Importing necessary modules and dependencies
import express from "express";
import listEndpoints from "express-list-endpoints";
import { MetallicaSongModel } from "../models/MetallicaSongModel";

// Creating an instance of the Express router
const router = express.Router()

// ------- The routes -------

// Show all endpoints available in a JSON format
router.get("/", (req, res) => {
   const endpoints = listEndpoints(router)
   res.json(endpoints);
});

// Show all Metallica songs
router.get("/songs", async (req, res) => {
    // Asynchronously retrieve all Metallica songs from the database
    await MetallicaSongModel.find()
    // If the retrieval is successful, handle the result
    .then((result) => res.json(result))
    // If an error occurs during the retrieval, handle the error
    .catch((error) => res.json(error))
})

// Show a specific Metallica song based on its MongoDB-generated _id
router.get("/songs/:id", (req, res) => {
    const songId = req.params.id;

    // Find a specific song by its MongoDB-generated _id using the Mongoose model
    MetallicaSongModel.findOne({ _id: songId })
        .then((song) => {
            // If the song is not found, send a 404 error response
            if (!song) {
                return res.status(404).json({ message: 'Song not found, please try another id' });
            }

            // Send the retrieved song as a JSON response
            res.json(song);
        })
        .catch((error) => {
            // If an error occurs during the database query, send an error response
            res.status(500).json({ message: 'Internal server error', error: error.message });
        });
});

// // Show a specific Metallica song based on its MongoDB-generated _id
// router.get("/songs/:id", async (req, res) => {
//     const songId = req.params.id
//     try {
// // Find a specific song by its MongoDB-generated _id using the Mongoose model
// const song = await MetallicaSongModel.findOne({ _id: songId })

// // If the song is not found, send a 404 error response
// if (!song) {
//     //.then((result) => res.json(result))
// return res.status(404).json({ message: 'Song not found, please try another id' })    
// }

// // Send the retrieved song as a JSON response
// res.json(song)
//  } catch (error) {
//     // If an error occurs during the database query, send an error response
//  res.status(500).json({ message: 'Internal server error', error: error.message })
// }
// })

// Show a specific Metallica album based on the album title
router.get("/albums/:title", (req, res) => {
    const albumTitle = req.params.title;

    // Find an album by its title using the Mongoose model
    MetallicaSongModel.find({ album: albumTitle })
        .then((album) => {
            // If the album is not found, send a 404 error response
            if (!album || album.length === 0) {
                return res.status(404).json({ message: 'Album not found, please try another album title' });
            }

            // Send the retrieved album as a JSON response
            res.json(album);
        })
        .catch((error) => {
            // If an error occurs during the database query, send an error response
            res.status(500).json({ message: 'Internal server error', error: error.message });
        });
});

// Export the router for use in the main application
//export default router
module.exports = router;