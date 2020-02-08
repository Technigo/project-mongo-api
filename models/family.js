import mongoose from 'mongoose'

const Family = mongoose.model('Family', {
    name: String,
    members: Number,
    color: String,
    location: String
})