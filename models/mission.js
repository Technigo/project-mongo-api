import mongoose from "mongoose";

const MissionSchema = mongoose.Schema({
  mission: String,
  shuttle: String,
  crew: Number,
  duration: String,
  launch_pad: String,
  landing_site: String
});

module.exports = mongoose.model("Mission", MissionSchema);