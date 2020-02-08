import mongoose from 'mongoose'

export const Plant = mongoose.model('Plant', {
    name: String,
    type: Number,
    isEdible: Boolean,
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    }
})