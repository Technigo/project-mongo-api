import db from '../models'

exports.getPokemonsList = (req, res) => {
  db.Pokemon.find({}, { pokemonNo: 1, name: 2, type: 3 })
    .then((poke) => {
      res.json({ poke })
    })
    .catch((err) => {
      res.send(err)
    })
}

exports.getPokemonDetails = (req, res) => {
  db.Pokemon.find({ name: req.params.name })
    .then((poke) => {
      res.json(poke)
    })
    .catch(err => {
      res.send(err)
    })
}