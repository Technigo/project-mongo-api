import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Sale = mongoose.model("Sale", {
  id: Number,
  date: Number,
  averagePrice: Number,
  totalVolume: Number,
  totalBagsSold: Number,
  smallBagsSold: Number,
  largeBagsSold: Number,
  xLargeBagsSold: Number,
  popularity: String
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

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// --- Start of ROUTES ---

// 1st route, the base path.
app.get("/", (req, res) => {
  res.send("Hello Avocado Sales Lover!");
});

// 2nd route. To get a specific sale, using try-catch code block and the _id. The _id is in the MongoDB Compass.
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

// 3rd route. To get a sale/sales with specific parameters, using try-catch. The params are; region & averagePrice.
app.get("/sales/", async (req, res) => {
  const {region, averagePrice} = req.query;
  const response = {
    success: true,
    body: {}
  }
  const matchAllRegex = new RegExp(".*");
  const regionQuery = region ? region : matchAllRegex;
  const averagePriceQuery = averagePrice ? averagePrice : matchAllRegex;
  try {
      response.body = await Sale.find({region: regionQuery, averagePrice: averagePriceQuery}).limit(3).sort({totalVolume: 1}).select({totalBagsSold: 1, largeBagsSold: 1})
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// The connection string that I will need:
// mongodb+srv://Maria:<password>@cluster0.0cj9ggy.mongodb.net/?retryWrites=true&w=majority

// RESET_DB=true npm run dev
// Go here:
// https://github.com/coreybutler/nvm-windows/releases
// download nvm-setup.exe
// run as admin
// open cmd as admin
// type nvm install v16.18.1
// https://mongoosejs.com/docs/queries

// https://regex101.com = regular expression

// /yourWordOfChoice/gm - regex to match yourWordOfChoice
// /.*/gm - regex to match every character in a string