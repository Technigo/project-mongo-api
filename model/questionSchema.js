import mongoose from 'mongoose'

const { Schema } = mongoose
const questionSchema = new Schema({
  id: Number,
  category: String,
  question: String,
  answer: String,
  option_1: String,
  option_2: String,
  difficulty: String,
  clue_1: String,
  clue_2: String,
  responded_to: Boolean,
  point: Boolean,
})

const Questions = mongoose.model('Questions', questionSchema)

export default Questions
