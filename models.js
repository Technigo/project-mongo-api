import mongoose from 'mongoose'


export const ArtistDetail = mongoose.model('ArtisDetail', {
 id: Number,
 name: String,
 years: String,
 genre: String,
 nationality: String,
 bio: String,
 wikipedia: String,
 paintings: Number
})