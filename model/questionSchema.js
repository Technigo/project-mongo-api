import mongoose from 'mongoose'

const { Schema } = mongoose
const questionSchema = new Schema({
  id: Number,
  category: String,
  question: String,
  answer: String,
  difficulty: String,
  clue_1: String,
  clue_2: String,
})

const Questions = mongoose.model('Questions', questionSchema)

export default Questions
