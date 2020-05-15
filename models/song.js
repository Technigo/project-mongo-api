import mongoose from 'mongoose'
const Song = mongoose.model('Song', {
  id: {
    type: Number,
  },
  trackName: {
    type: String,
  },
  artistName: {
    type: String,
  },
  genre: {
    type: String,
  },
  bpm: {
    type: Number,
  },
  energy: {
    type: Number,
  },
  danceability: {
    type: Number,
  },
  loudness: {
    type: Number,
  },
  liveness: {
    type: Number,
  },
  valence: {
    type: Number,
  },
  length: {
    type: Number,
  },
  acousticness: {
    type: Number,
  },
  speechiness: {
    type: Number,
  },
  popularity: {
    type: Number,
  },
})
export default Song