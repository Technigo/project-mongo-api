import mongoose from 'mongoose'
import data from '../data/types.json'

const typeSchema = new mongoose.Schema(
  {
    "type": String,
    "color": String
  }
)

const Type = mongoose.model('Type', typeSchema)

if (process.env.RESET_DB) {
  console.log("seeding started")
  const seedDatabase = async () => {
    await Type.deleteMany({})

    data.forEach((type) => {
      new Type(type).save()
    })
  }

  seedDatabase()
}

module.exports = Type