import mongoose from 'mongoose'
import crypto from 'crypto'

export const User = mongoose.model('User', {
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex')
  }
});