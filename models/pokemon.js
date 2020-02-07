import mongoose from 'mongoose'
import data from '../data/pokemon.json'

const pokemonSchema = new mongoose.Schema(
  {
    "pokemonNo": Number,
    "name": String,
    "type": Array,
    "HP": Number,
    "Attack": Number,
    "Defense": Number,
    "SpAttack": Number,
    "SpDefense": Number,
    "Speed": Number
  }
)

const Pokemon = mongoose.model('Pokemon', pokemonSchema)

if (process.env.RESET_DB) {
  console.log("seeding started")
  const seedDatabase = async () => {
    await Pokemon.deleteMany({})

    data.forEach((poke) => {
      new Pokemon(poke).save()
    })
  }

  seedDatabase()
}

module.exports = Pokemon