import mongoose from "mongoose";

const { Schema } = mongoose;

// https://mongoosejs.com/docs/schematypes.html
export const netflixTitleSchema = new Schema({
    show_id:{
        type: Number,
    },
    title:{
        type: String,
    },
    director:{
        type: String,
    },
    cast:{
        type: String,
/*         type: [mongoose.Schema.Types.ObjectId],
        ref:"actor" */
    },
    country:{
        type: String,
/*         type: [mongoose.Schema.Types.ObjectId],
        ref:"countries" */
    },
    date_added:{
        type: String,
    },
    release_year:{
        type: Number,
    },
    rating:{
        type: String,
    },
    duration:{
        type: String,
    },
    listed_in:{
        type: String,
    },
    description:{
        type: String,
    },
    type:{
        type: String,
    }
})

// Create a Mongoose model named 'NetflixTitleModel' based on the 'netflixTitleSchema' for the 'netflixTitles' collection
export const NetflixTitleModel = mongoose.model("netflixTitles", netflixTitleSchema)

