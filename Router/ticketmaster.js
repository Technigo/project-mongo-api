import express from 'express'
import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'

import Events from '../data/ticketmaster.json'

const router = express.Router();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const EventSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    lowercase: true
  },
  type: {
    type: String,
    require: true
  },
  id: {
    type: String,
    require: true
  },
  images: {
    type: [{ _id: false, url: String, width: Number, height: Number }]
  },
  dates: {
    type: [
      {
        _id: false,
        start: {
          type: [
            {
              _id: false,
              dateTime: String
            }
          ]
        }
      }
    ]
  }
});

const Event = mongoose.model("Event", EventSchema);

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Event.deleteMany()
    await Events._embedded.events.forEach((item) => {
      const newEvent = new Event(item);
      newEvent.save()
    }) 
  }
  seedDB()
}   

router.get('/', async (req, res) => {
  try {
    res.json(listEndpoints(router))
  } catch (err) {
    res.status(404).send({ error: "Not found" })
  }
})

router.get('/about', (req, res) => {
  
})

router.get('/event/id/:id', async (req, res) => {
  try {
    await Event.findOne({ id: req.params.id })
      .then((event) => {
        return event ? res.json(event) : res.status(404).send({ error: "Invalid id" })
      })
  } catch (err) {
    res.status(404).send({ error: "Page not found" })
  }
})

router.get('/events/summer21', async (req, res) => {
  try {
    const startDate = new Date("2021-06-08").toISOString()
    const endDate = new Date("2021-08-08").toISOString()
    await Event.find({ "dates.start.dateTime": { $gte: startDate, $lte: endDate } })
      .then((event) => {
        return event ? res.json(event) : res.status(404).send({ error: "No events found" })
      })
  } catch (err) {
    res.status(404).send({ error: "Page not found" })
  }
})
module.exports = router;