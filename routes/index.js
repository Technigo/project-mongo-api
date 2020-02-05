import express from 'express';
import path from 'path';
import Show from '../models/show';

const router = express.Router();

// GET routes
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/shows', (req, res) => {
  Show.find().then(shows => {
    res.json(shows);
  });
});

router.get('/shows/:id', (req, res) => {
  Show.find({ _id: req.params.id }).then(show => {
    if (show) {
      res.json(show);
    } else {
      res.status(404).json({
        error: 'Not found'
      });
    }
  });
});

module.exports = router;
