import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const GoldenGlobes = mongoose.model('GoldenGlobes', {
  year_film: {
    type: Number,
  },
  year_award: {
    type: Number,
  },
  ceremony: {
    type: Number,
  },
  category: {
    type: String,
  },
  nominee: {
    type: String,
  },
  film: {
    type: String,
  },
  win: {
    type: Boolean,
  },
});

// RESET_DATABASE=true npm run dev
if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await GoldenGlobes.deleteMany();
    await goldenGlobesData.forEach((goldenGlobe) => new GoldenGlobes(goldenGlobe).save());
  };
  seedDatabase();
}

const port = process.env.PORT || 9000
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

app.get('/', async (req, res) => {
  const goldenGlobes = await GoldenGlobes.find();
  res.json(goldenGlobes);
})

app.get('/year/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const { won, category } = req.query;    
    const mongoQuery = { year_award: year };
    
    if (won) {
      mongoQuery.win = won
    } 
    
    if (category) {
      mongoQuery.category = new RegExp(category, 'i')
    }

    const goldenGlobesYear = await GoldenGlobes.find(mongoQuery);
    if (goldenGlobesYear.length < 1) {
      res.status(404).json({ error: 'Data not found' });
    } else {
      res.json(goldenGlobesYear);
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid request'});
  }
})

app.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { won } = req.query;    
    const mongoQuery = { category: category };
    
    if (won) {
      mongoQuery.win = won
    }

    const goldenGlobesCategory = await GoldenGlobes.find(mongoQuery);
    if (goldenGlobesCategory.length < 1) {
      res.status(404).json({ error: 'Data not found' });
    } else {
      res.json(goldenGlobesCategory);
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid request'});
  }
})

app.get('/search/nominee', async (req, res) => {
  try {
    const { nominee } = req.query;
    const queryRegex = new RegExp(nominee, 'i');
    const goldenGlobesNominee = await GoldenGlobes.find({ nominee: queryRegex });
    if (goldenGlobesNominee.length < 1) {
      res.status(404).json({ error: 'Nominee not found' });
    } else {
      res.json(goldenGlobesNominee);
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid request'}); 
  }
})

app.get('/nominee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const goldenGlobesNominee = await GoldenGlobes.findOne({ _id: id });
    
    if (goldenGlobesNominee.length < 1) {
      res.status(404).json({ error: 'Nominee not found' })
    } else {
      res.json(goldenGlobesNominee)
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid request'})
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

