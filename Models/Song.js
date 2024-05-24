import mongoose from "mongoose"

// Schema - the blueprint

const { Schema } = mongoose

const musicSchema = new Schema({
trackName: 
{type: String,
required: true
},

artistName: {String,
    required: true
},
genre: {String,
    required: true },

bpm: {Number,
    required:true
},

energy: Number,
danceability: Number,
loudness: Number,
liveness: Number,
valence: Number,
length: Number,
acousticness: Number,
speechiness: Number,
popularity: Number
})
// The Model
const Song = mongoose.model('Song', musicSchema)

export default Song