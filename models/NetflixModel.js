import mongoose from "mongoose";

const NetflixSchema = new mongoose.Schema({
    show_id: Number,
    title: String,
    director: String,
    cast: String,
    country: String,
    date_added: String,
    release_year: Number,
    rating: String,
    duration: String,
    listed_in: String,
    description: String,
    type: String,
});

export const Netflix = mongoose.model("Netflix", NetflixSchema);
