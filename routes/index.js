import { Router } from 'express';
import * as sightingController from '../controllers/sightingController'
import * as sightings from './sightings';
import * as lists from './lists';

const router = new Router();

router.get('/sightings', sightingController.getAllSightings);
router.get('/sightings/:id', sightings.view);

router.get('/lists/preInternet', lists.preInternet);
router.get('/lists/postInternet', lists.postInternet);
router.get('/lists/shapes', lists.shapes);

export default router;
