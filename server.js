import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import avocadoSalesData from "./data/avocado-sales.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const Avocado = mongoose.model("Avocado", {
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
    avocadoSalesData.forEach(singleAvocado => {
      const newAvocado = new Avocado(singleAvocado)
      newAvocado.save();
    })

  }
  resetDataBase();
}

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.send("Hello Technigo hihi!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
