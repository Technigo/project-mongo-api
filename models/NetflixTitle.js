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

export const actorSchema = new Schema({
    name:{
        type: String
    },
/*     title:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "netflixTitles"
    } */     
    })

export const countrySchema = new Schema({
        name:{
            type: String
        },      
        })

// This model is used to interact with the collections in the MongoDB database. It allows you to perform CRUD operations on documents in that collection and provides methods for data validation based on the schema.

// Create a Mongoose model named 'NetflixTitleModel' based on the 'netflixTitleSchema' for the 'netflixTitles' collection
export const NetflixTitleModel = mongoose.model("netflixTitles", netflixTitleSchema)

// Create a Mongoose model named 'ActorModel' based on the 'actorSchema' for the 'actors' collection
export const ActorModel = mongoose.model("actors", actorSchema)

// Create a Mongoose model named 'CountryModel' based on the 'countrySchema' for the 'countries' collection
export const CountryModel = mongoose.model("countries", countrySchema)