/* eslint-disable max-len */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

import btc from './data/btc.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/btc"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const btcHistoricalSchema = new mongoose.Schema({
  SNo: Number,
  Name: String,
  Symbol: String,
  Date: String,
  High: Number,
  Low: Number,
  Open: Number,
  Close: Number,
  Volume: Number,
  Marketcap: Number
});

const BtcHistorical = mongoose.model('BtcHistorical', btcHistoricalSchema);

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await BtcHistorical.deleteMany();

    await btc.forEach((item) => {
      const newBtcHistorical = new BtcHistorical(item);
      newBtcHistorical.save();
    });
  }
  seedDB();
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (_, res) => {
  res.send(listEndpoints(app));
})

app.get('/btc-historical-prices', async (req, res) => {
  try {
    const btcData = await BtcHistorical.find();
    res.status(200).json(btcData);
  } catch (error) {
    res.status(404).json({ error: 'Not found' })
  }
});

// find / display one closing price at a date close to the start of May 2013 + the market cap on that day 
app.get('/btc-historical-prices/2013', async (req, res) => {
  try {
    const btcData = await BtcHistorical.find();
    const btc2013 = btcData.filter((item) => item.SNo === 3)
    res.status(200).json({ dataMay2013: { closingPrice: btc2013[0].Close, marketCap: btc2013[0].Marketcap } });
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

// Closing Price and Marketcap May 2014
app.get('/btc-historical-prices/2014', async (req, res) => {
  const btcData = await BtcHistorical.find();
  const btc2014 = btcData.filter((item) => item.SNo === 369)
  if (btc2014) {
    res.status(200).json({ dataMay2014: { closingPrice: btc2014[0].Close, marketCap: btc2014[0].Marketcap } });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// 2015
app.get('/btc-historical-prices/2015', async (req, res) => {
  const btcData = await BtcHistorical.find();
  const btc2015 = btcData.filter((item) => item.SNo === 733)
  if (btc2015) {
    res.status(200).json({ dataMay2015: { closingPrice: btc2015[0].Close, marketCap: btc2015[0].Marketcap } });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});
// 2016
app.get('/btc-historical-prices/2016', async (req, res) => {
  const btcData = await BtcHistorical.find();
  const btc2016 = btcData.filter((item) => item.SNo === 1099)
  if (btc2016) {
    res.status(200).json({ dataMay2016: { closingPrice: btc2016[0].Close, marketCap: btc2016[0].Marketcap } });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});
// 2017
app.get('/btc-historical-prices/2017', async (req, res) => {
  const btcData = await BtcHistorical.find();
  const btc2017 = btcData.filter((item) => item.SNo === 1464)
  if (btc2017) {
    res.status(200).json({ dataMay2017: { closingPrice: btc2017[0].Close, marketCap: btc2017[0].Marketcap } });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});
// 2018
app.get('/btc-historical-prices/2018', async (req, res) => {
  const btcData = await BtcHistorical.find();
  const btc2018 = btcData.filter((item) => item.SNo === 1844)
  if (btc2018) {
    res.status(200).json({ dataMay2018: { closingPrice: btc2018[0].Close, marketCap: btc2018[0].Marketcap } });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});
// 2019
app.get('/btc-historical-prices/2019', async (req, res) => {
  const btcData = await BtcHistorical.find();
  const btc2019 = btcData.filter((item) => item.SNo === 2196)
  if (btc2019) {
    res.status(200).json({ dataMay2019: { closingPrice: btc2019[0].Close, marketCap: btc2019[0].Marketcap } });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});
// 2020
app.get('/btc-historical-prices/2020', async (req, res) => {
  const btcData = await BtcHistorical.find();
  const btc2020 = btcData.filter((item) => item.SNo === 2561)
  if (btc2020) {
    res.status(200).json({ dataMay2020: { closingPrice: btc2020[0].Close, marketCap: btc2020[0].Marketcap } });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});
// 2021
app.get('/btc-historical-prices/2021', async (req, res) => {
  const btcData = await BtcHistorical.find();
  const btc2021 = btcData.filter((item) => item.SNo === 2859)
  if (btc2021) {
    res.status(200).json({ dataFeb2021: { closingPrice: btc2021[0].Close, marketCap: btc2021[0].Marketcap } });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
