import mongoose from "mongoose";

const Volcano = new mongoose.model("Volcano", {
  Number: Number,
  Name: String,
  Country: String,
  Region: String,
  Type: String,
  ActivityEvidence: String,
  LastKnownEruption: String,
  Latitude: Number,
  Longitude: Number,
  ElevationMeters: Number,
  DominantRockType: String,
  TectonicSetting: String,
});

export default Volcano;
