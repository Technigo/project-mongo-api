import mongoose from 'mongoose'

const Author = mongoose.model('Author', {
  authors: String
})

export default Author