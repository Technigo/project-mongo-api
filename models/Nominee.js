import mongoose, { Schema } from "mongoose";

// const { Schema } = mongoose;

export const nomineeSchema = new Schema({
    // Complex Object Config
   
    year_film: {
        type: Number,
        required: true,
    },
    year_award: {
        type: Number,
        required: true,
    },
    ceremony: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    nominee: {
        type: String,
        required: true,
    },
    film: {
        type: String,
        required: false,
    },
    win: {
        type: Boolean,
    },

});

export const NomineeModel = mongoose.model("Nominee", nomineeSchema);
