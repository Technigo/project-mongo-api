import express from 'express'
const router = express.Router()

import helpers from '../helpers/types'

router.route('/')
  .get(helpers.getTypesList)

router.route('/:type')
  .get(helpers.getTypeDetails)

export default router