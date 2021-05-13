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
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    }
  }
});

export default Sighting;
