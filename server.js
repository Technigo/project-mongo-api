import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import AvocadoSalesData from "./data/avocado-sales.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

const AvocadoSales = mongoose.model("AvocadoSales", {
  id: Number,
  date: Date,
  averagePrice: Number,
  totalVolume: Number,
  totalBagsSold: Number,
  smallBagsSold: Number,
  largeBagsSold: Number,
  xLargeBagsSold: Number,
  region: String,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await AvocadoSales.deleteMany({});

    AvocadoSalesData.forEach((salesData) => {
      new AvocadoSales(salesData).save();
    });
  };

  seedDatabase();
}

app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  const documentation = endpoints.map((endpoint) => ({
    method: endpoint.methods.join(", "),
    path: endpoint.path,
  }));
  res.json(documentation);
});

app.get("/avocado-sales/region", async (req, res) => {
  try {
    const avocadoSalesRegion = await AvocadoSales.aggregate([
      { $group: { _id: "$region", sales: { $push: "$$ROOT" } } },
      { $project: { "sales._id": 0, "sales.__v": 0 } },
      { $sort: { _id: 1 } },
    ]);

    const formattedData = avocadoSalesRegion.reduce((acc, cur) => {
      acc[cur._id] = cur.sales;
      return acc;
    }, {});
    res.json(formattedData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error: region" });
  }
});

app.get("/avocado-sales/region/:regionName", async (req, res) => {
  try {
    const regionName = req.params.regionName;
    const AvocadoSalesByRegionName = await AvocadoSales.find({
      region: regionName,
    })
      .select("-_id -__v")
      .sort({ id: 1 });
    res.json(AvocadoSalesByRegionName);
  } catch (error) {
    res.status(500).json({ error: "Internal server error: sales by region" });
  }
});

app.get("/avocado-sales", (req, res) => {
  AvocadoSales.find()
    .select("-_id -__v")
    .sort({ id: 1 })
    .then((sales) => {
      res.json(sales);
    });
});

app.get("/avocado-sales/:date", async (req, res) => {
  try {
    const userInputDate = req.params.date;
    const date = new Date(userInputDate).toISOString();
    const AvocadoSalesByDate = await AvocadoSales.find({ date })
      .select("-_id -__v")
      .sort({ id: 1 });
    res.json(AvocadoSalesByDate);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
