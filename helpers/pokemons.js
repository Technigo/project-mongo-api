import db from '../models'

exports.getPokemonsList = (req, res) => {
  db.Pokemon.find()
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