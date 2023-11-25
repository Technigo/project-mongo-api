import mongoose from "mongoose";

const { Schema } = mongoose;

export const actorSchema = new Schema({
    name:{
        type: String
    },
/*     title:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "netflixTitles"
    } */     
    })

    // Create a Mongoose model named 'ActorModel' based on the 'actorSchema' for the 'actors' collection
export const ActorModel = mongoose.model("actors", actorSchema)