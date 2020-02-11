import mongoose from 'mongoose'

export const Guest = mongoose.model('Guest', {
  first_name: { type: String, requierd: true, minlength: 2 },
  last_name: { type: String, requierd: true, minlength: 2 },
  email: { type: String },
  phone: { type: Number },
  allergies: { type: String },
  other: { type: String },
  addedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAttending: { type: Boolean, required: true },
})