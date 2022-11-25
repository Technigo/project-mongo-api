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

if(true) {
  const resetDataBase = async () => {
    avocadoSalesData.forEach(singleAvocado => {
      const newAvocado = new Avocado(singleAvocado);
      newAvocado.save();
    })

  }
  resetDataBase();
}

app.use(cors());
app.use(express.json());

// Routes
app.get("/", async (req, res) => {
const EveryAvocado = await Avocado.find({});
res.status(200).json({
  success: true, 
  body: EveryAvocado
})
});

app.get("/id/:id", async (req, res) => {
  try {
    const SingleAvocado = await Avocado.findById(req.params.id);
    if (SingleAvocado) {
      res.status(200).json({
        success: true,
        body: SingleAvocado
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the region of the avocado"
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
  
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
