// mongoose model for BirdFamily
import mongoose from 'mongoose';

const BirdFamily = mongoose.model('BirdFamily', {
    name: String,
    habitat: String,
    diet: String,
    averageLifespan: Number,
});

export default BirdFamily;
