import express from 'express'
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ig-noble-prize";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const { Schema } = mongoose;

const prizeSchema = new Schema ({
  _id: String,
  Year: Number,
  Subject: String,
  Description: String
});

const Prize = mongoose.model("Prize", prizeSchema);


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Welcome message
app.get('/', (req, res) => {
  res.send('Search IG Noble Prize by year, category or description (free text)')
});

// Full list of Ig Noble Prizes
app.get('/prizes', async (req, res) => {
  try {
    const prizeList = await Prize.find();

    if (prizeList.length > 0) {
      res.status(200).json({
        success: true,
        message: `Found ${prizeList.length} prizes`,
        body: {
          prizelist: prizeList,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No prizes found',
        body: {},
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e,
      body: {},
    });
  }
});

// Not working properly
app.get("/prizes/:id", async (req, res) => {
  try {
    const singlePrizeByID = await Prize.findById(req.params.id);

    if (singlePrizeByID) {
      res.status(200).json({
        success: true,
        body: singlePrizeByID
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: 'Prize not found'
        }
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
