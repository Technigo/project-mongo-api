// mongoose model for Bird
import mongoose from 'mongoose';

const Bird = mongoose.model('Bird', {
    name: String,
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BirdFamily',
    },
    habitat: String,
    diet: String,
    averageLifespan: Number,
    imageUrl: String,
    description: String,
});

export default Bird;
