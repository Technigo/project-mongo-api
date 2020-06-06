import mongoose from 'mongoose'

const Author = mongoose.model('Author', {
  name: String
})

export default Author