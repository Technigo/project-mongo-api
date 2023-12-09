import mongoose from "mongoose";

const { Schema } = mongoose;

const NetflixSchema = new Schema({
  //Defining the schema, piece by piece
  title: {
    type: String,
  },
  country: {
    type: String,
  },
  release_year: {
    type: Number,
  },
  rating: {
    type: String,
  },
  show_id: {
    type: Number,
  },
});

const ModelNetflix = mongoose.model("Netflix", NetflixSchema);

export { ModelNetflix };
