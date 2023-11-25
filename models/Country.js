import mongoose from "mongoose";

const { Schema } = mongoose;

export const countrySchema = new Schema({
    name:{
        type: String
    },      
    })

// Create a Mongoose model named 'CountryModel' based on the 'countrySchema' for the 'countries' collection
export const CountryModel = mongoose.model("countries", countrySchema)