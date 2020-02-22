import mongoose from 'mongoose'

export const Guest = mongoose.model('Guest', {
  first_name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  last_name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  phone: {
    type: Number
  },
  allergies: {
    type: String
  },
  other: {
    type: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isAttending: {
    type: Boolean,
    required: true
  },
})