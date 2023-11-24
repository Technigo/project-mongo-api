import mongoose, { model } from "mongoose"

const Schema = mongoose.Schema

export const songSchema = new Schema(
    {
        trackName: { type: String },
        artistName: { type: String },
        genre: { type: String },
        length: { type: Number },
        bpm: { type: Number },
        energy: { type: Number },
        danceability: { type: Number },
        popularity: { type: Number }
    }
)

//Create a Mongoose model. This model is used to interact with the "songs collection" in the MongoDB Database. It allows you to perform CRUD operations om documents in that collection and provides methods fro data validation based on the schema.
const Song = mongoose.model("Song", songSchema)
console.log(Song)
module.exports = Song