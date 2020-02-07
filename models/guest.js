import mongoose from 'mongoose'

export const Guest = mongoose.model('Guest', {
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  phone: { type: Number },
  allergies: { type: String },
  other: { type: String },
  added: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  isAttending: { type: Boolean },
})