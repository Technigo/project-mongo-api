import { Router } from 'express';
import * as sightings from '../controllers/sightingController';
import * as lists from '../controllers/listController';

const router = new Router();

router.get('/sightings', sightings.getAll);
router.get('/sightings/:id', sightings.getOne);

router.get('/lists/preInternet', lists.getList('preInt'));
// router.get('/lists/postInternet', lists.getList('postInt'));
// router.get('/lists/shapes', lists.getList('shapes));

export default router;
