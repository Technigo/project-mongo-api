import mongoose from 'mongoose'

export const Artist = mongoose.model('Artist', {
  id: Number,
  name: String,
  nationality: String

})
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