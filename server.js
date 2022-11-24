import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

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
    await Avocado.deleteMany();
    avocadoSalesData.forEach(singleAvocado => {
      const newAvocado = new Avocado(singleAvocado);
      newAvocado.save();
    })

  }
  resetDataBase();
}



// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", async (req, res) => {
const EveryAvocado = await Avocado.find();
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
