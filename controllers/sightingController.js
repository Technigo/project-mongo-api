import Sighting from '../models/sightingModel'
import * as base from './baseController'

export const getAllSightings = base.getAll(Sighting)
