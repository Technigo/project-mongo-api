import mongoose from "mongoose";

const { Schema, model } = mongoose;

const citySchema = new Schema({
  city: String,
  province: String,
  population: Number,
  area_size: Number,
  dialects: [String],
});

const City = model("City", citySchema);

export default City;
