import mongoose from "mongoose";

const AstronautSchema = mongoose.Schema({
  id: Number,
  name: String,
  year: Number,
  group: Number,
  status: String,
  birthDate: String,
  birthPlace: String,
  gender: String,
  almaMater: String,
  underGraduateMajor: String,
  graduateMajor: String,
  militaryRank: String,
  militaryBranch: String,
  spaceFlights: Number,
  spaceFlight_hr: Number,
  spaceWalks: Number,
  spaceWalks_hr: Number,
  missions: String,
  deathDate: String,
  deathMission: String,
});

module.exports = mongoose.model("Astronaut", AstronautSchema)