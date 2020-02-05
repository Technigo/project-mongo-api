import express from 'express';
import path from 'path';
import { celebrate } from 'celebrate';
import { stringSearch } from '../helpers/stringSearch';
import Show from '../models/show';
import { showObjectSchema } from '../validation/showObjectSchema';

const router = express.Router();

// GET routes
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/shows', (req, res) => {
  const {
    director,
    title,
    actor,
    country,
    year,
    rating,
    duration,
    categories,
    description,
    type
  } = req.query;
  const queryObject = {};

  if (title) {
    queryObject.title = stringSearch(title);
  }

  if (director) {
    queryObject.director = stringSearch(director);
  }

  if (actor) {
    queryObject.cast = stringSearch(actor);
  }

  if (country) {
    queryObject.country = stringSearch(country);
  }

  if (year) {
    queryObject.release_year = +year;
  }

  if (rating) {
    queryObject.rating = stringSearch(rating);
  }

  if (duration) {
    queryObject.duration = stringSearch(duration);
  }

  if (categories) {
    queryObject.listed_in = stringSearch(categories);
  }

  if (description) {
    queryObject.description = stringSearch(description);
  }

  if (type) {
    queryObject.type = stringSearch(type);
  }

  Show.find(queryObject).then(shows => {
    res.json({
      status: '200 OK',
      message: 'Movies fetched successfully',
      query: req.query,
      data: shows
    });
  });
});

router.get('/shows/:id', (req, res) => {
  Show.find({ show_id: req.params.id }).then(show => {
    if (show) {
      res.json(show);
    } else {
      res.status(404).json({
        error: 'Not found'
      });
    }
  });
});

// POST routes
router.post('/shows', celebrate({ body: showObjectSchema }), (req, res) => {
  const newShow = req.body;
  return res.json(newShow);
});

module.exports = router;
