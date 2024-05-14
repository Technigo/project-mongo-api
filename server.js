import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import avocadoSalesData from "./data/avocado-sales.json" with { type: "json" };

// Database connection
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const app = express();
const port = process.env.PORT || 8080;

// Avocado sales model
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

// Seed database if required
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await AvocadoSales.deleteMany();
    const salesDocuments = avocadoSalesData.map(
      (salesData) => new AvocadoSales(salesData)
    );
    await AvocadoSales.insertMany(salesDocuments);
    console.log("Database seeded");
  };
  seedDatabase();
}

// Middleware
app.use(cors());
app.use(express.json());

// API documentation endpoint
app.get("/", (req, res) => {
  res.json(
    expressListEndpoints(app).map((endpoint) => ({
      method: endpoint.methods.join(", "),
      path: endpoint.path,
      description: "Describe what each endpoint does",
    }))
  );
});

// List all sales
app.get("/avocado-sales", async (req, res) => {
  try {
    const sales = await AvocadoSales.find().select("-_id -__v").sort({ id: 1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve sales data" });
  }
});

// Get sales by region
app.get("/avocado-sales/region/:regionName", async (req, res) => {
  const { regionName } = req.params;
  try {
    const sales = await AvocadoSales.find({ region: regionName })
      .select("-_id -__v")
      .sort({ id: 1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve sales by region" });
  }
});

// Get sales by specific date
app.get("/avocado-sales/date/:date", async (req, res) => {
  const { date } = req.params;
  try {
    const formattedDate = new Date(date).toISOString();
    const sales = await AvocadoSales.find({ date: formattedDate })
      .select("-_id -__v")
      .sort({ id: 1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve sales by date" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
