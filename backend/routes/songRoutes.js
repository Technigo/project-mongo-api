const express = require('express')
const router = express.Router()
const { Song } = require('../models/Song')
const listEndpoints = require('express-list-endpoints')

// Main route
router.get("/", (req, res) => {
  res.send(listEndpoints(router))
})

//Route to all songs
router.get("/songs", (req, res) => {
  Song.find()
  .then(songs => {
    if (songs.length > 0) {
      res.json(songs)
    } else {
      res.status(404).json({error: "The database is empty, no songs found"})
    }
  })
  .catch(error => {
    res.status(500).json({error: "Something went wrong while loading the songs from the database"})
  })
})

// Route to one song
router.get("/songs/:songId", async (req, res) => {
  try {
    const song = await Song.findById(req.params.songId)
    
    if (song) {
      res.json(song)
    } else {
      res.status(404).json({error: "We can't find a song with that ID"})
    }
  } catch (error) {
    res.status(400).json({error: "Invalid song ID, please double check"})
  }
})

//Route to a specific artist
router.get("/artists/:artist", async (req, res) => {
  const paramArtistName = req.params.artist

  //Regex to make it not case-sensitive (option: i) while searching for any of the artists of a song
  const artistSongs = await Song.find({ artistName: { $regex : paramArtistName, $options: "i" } });

  if (artistSongs === 0) {
    res.status(404).json("We're sorry, this artist hasn't made any songs in our API")
  }

  res.json(artistSongs)
})

//Route to a specific genre
router.get("/genres/:specificGenre", async (req, res) => {
  try {
    const song = await Song.find({genre: { $regex : req.params.specificGenre, $options: "i" } })

    if (song.length > 0) {
      res.json(song)
    } else {
      res.status(404).json({error: "There are no songs of that genre"})
    }
  } catch (error) {
    res.status(400).json({error: "This genre isn't stored in our API"})
  }
})

//Route to songs with danceability over 70
router.get("/danceable", (req, res) => {
  Song.find({ danceability: {$gte: 70} })
    .then(songs => {
      if (songs.length > 0) {
        res.json(songs)
      } else res.status(404).json({error: "There are no dancable songs"})
    }).catch(err => {
      res.status(500).json({error: `Internal server error: $(err)`})})
})

module.exports = router