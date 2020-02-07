import express from 'express'
const router = express.Router()

import helpers from '../helpers/pokemons'

router.route('/')
  .get(helpers.getPokemonsList)

router.route('/:name')
  .get(helpers.getPokemonDetails)

export default router