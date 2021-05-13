import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import btc from './data/btc.json'

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
  const btcData = await BtcHistorical.find();
  res.json(btcData);
});

// find / display one closing price at a date close to the start of May 2013 + the market cap on that day 
app.get('/btc-historical-prices/2013', async (req, res) => {
  const btcData = await BtcHistorical.find();
  const btc2013 = await btcData.filter((item) => item.SNo === 3)
  if (btc2013) {
    res.status(200).json({ dataMay2013: { closingPrice: btc2013[0].Close, marketCap: btc2013[0].Marketcap } });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Closing Price and Marketcap May 2014
app.get('/btc-historical-prices/2014', async (req, res) => {
  const btcData = await BtcHistorical.find();
  const btc2014 = await btcData.filter((item) => item.SNo === 369)
  if (btc2014) {
    res.status(200).json({ dataMay2014: { closingPrice: btc2014[0].Close, marketCap: btc2014[0].Marketcap } });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// 2015
app.get('/btc-historical-prices/2015', async (req, res) => {
  const btcData = await BtcHistorical.find();
  const btc2015 = await btcData.filter((item) => item.SNo === 733)
  if (btc2015) {
    res.status(200).json({ dataMay2015: { closingPrice: btc2015[0].Close, marketCap: btc2015[0].Marketcap } });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});
// 2016
// 2017
// 2018
// 2019
// 2020
// 2021

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
