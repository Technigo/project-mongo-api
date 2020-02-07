import express from 'express';
import path from 'path';
import { celebrate, Segments } from 'celebrate';
import validation from '../validation/validation';
import showHandler from '../handlers/showHandlers';

const router = express.Router();

// GET routes
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

router.get(
  '/shows',
  celebrate({ [Segments.QUERY]: validation.showQuerySchema }),
  showHandler.getAllShows
);

router.get('/shows/:id', showHandler.getShowById);

// POST routes
router.post(
  '/shows',
  celebrate({ [Segments.BODY]: validation.showObjectSchema }),
  showHandler.postShow
);

module.exports = router;
