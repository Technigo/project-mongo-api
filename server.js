import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import avocadoSalesData from "./data/avocado-sales.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Using a Mongoose model to model my data and to fetch data from the database.
const Sale = mongoose.model("Sale", {
  id: Number,
  date: String,
  averagePrice: Number,
  totalVolume: Number,
  totalBagsSold: Number,
  smallBagsSold: Number,
  largeBagsSold: Number,
  xLargeBagsSold: Number,
  region: String
});

if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Sale.deleteMany();
    avocadoSalesData.forEach(singleSale => {
      const newSale = new Sale(singleSale);
      newSale.save();
    })
  }
  resetDataBase();
}

const port = process.env.PORT || 8080;
const app = express()

app.use(cors());
app.use(express.json());

// --- Start of ROUTES ---

// 1st route, the base path.
app.get("/", (req, res) => {
  res.send("Hello Avocado Sales Lover!");
});

// 2nd route. To get a specific sale, using try-catch code block and the _id. The _id is from the MongoDB Compass.
app.get("/sales/id/:id", async (req, res) => {
  try {
    const singleSale = await Sale.findById(req.params.id);
    if (singleSale) {
      res.status(200).json({
        success: true,
        body: singleSale
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the sale"
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }
});

// 3rd route. To get an array of sales (if there are more than one) with specific parameters, using try-catch code block and query.
app.get("/sales/", async (req, res) => {
  const {region, averagePrice} = req.query;
  const response = {
    success: true,
    body: {}
  }
  const matchAllRegex = new RegExp(".*");
  const regionQuery = region ? region : matchAllRegex;
  const averagePriceQuery = averagePrice ? averagePrice : {$gt: 0, $lt: 100};
  try {
      response.body = await Sale.find({region: regionQuery, averagePrice: averagePriceQuery}).limit(5).sort({totalVolume: 1}).select({totalBagsSold: 1, largeBagsSold: 1})
    res.status(200).json({
      success: true,
      body: response
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: error
      }
    });
  }
});
// --- End of ROUTES ---

// To start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});