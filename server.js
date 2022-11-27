import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
import avocadoSalesData from "./data/avocado-sales.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const AvocadoSale = mongoose.model("AvocadoSale", {
  "id": Number,
  "date": String,
  "averagePrice": Number,
  "totalVolume": Number,
  "totalBagsSold": Number,
  "smallBagsSold": Number,
  "largeBagsSold": Number,
  "xLargeBagsSold": Number,
  "region": String
});

if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await AvocadoSale.deleteMany();
    avocadoSalesData.forEach(singleAvocado => {
      const newAvocadoSales = new AvocadoSale (singleAvocado);
      newAvocadoSales.save();
    })
  } 
  resetDataBase();
};


const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here

//Start page 
app.get("/", (req, res) => {
  res.send({
  Message: "Avocado sale data", 
  Routes: [{ 
  "/avocadoSales/:date": "example: /avocadoSales/2015-10-25",
  "/highestPrice": "Just highest price available in the data",
  "/avocados/:id": "example: /avocados/56"
  }]
 
  });
});

// All the data
app.get("/avocadoSales", async (req, res) => {
  const allTheAvocadoSales =  await AvocadoSale.find({});
  res.status(200).json({
    success: true,
    body: allTheAvocadoSales
  })
}); 

// All the data sorted by highest average price
app.get("/avocadoSales/highestPrice", async (req, res) => {
  const highestPriceAvocadoSale = await AvocadoSale.find({}).sort({averagePrice: -1})
  res.status(200).json({
    success: true, 
    body: highestPriceAvocadoSale
  })
});

// Only one sales id 
app.get("/avocadoSales/id/:id", async (req, res) => {
  try {
    const singleAvocadoSale = await AvocadoSale.findById(req.params.id);

    if (singleAvocadoSale) {
      res.status(200).json({
        success: true,
        body: singleAvocadoSale
    });
  } else {
    // this error will return if the format of the key is right but for an example a character is wrong
    res.status(404).json({
      success: false,
      body: {
        message: "Sorry, no sales data for that id."
      }
    });
  } 
  // this error shows if the id has wrong format like if you put in nonly "5". 
} catch(error) {
  res.status(400).json({
    success: false,
    body: {
      message: "Invalid id"
    }
  });
}
}); 

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
