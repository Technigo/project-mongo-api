import mongoose from 'mongoose';

const Sighting = mongoose.model('Sighting', {
  date: Date,
  city: String,
  state: String,
  country: String,
  shape: String,
  duration_seconds: Number,
  duration_description: String,
  comments: String,
  date_posted: String,
  position: {
    latitude: Number,
    longitude: Number
  }
});

export default Sighting;
