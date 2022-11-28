import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ProductData from "./data/ikea-products.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-ikea";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Product = mongoose.model("Product", {
  item_id: Number,
  name: String,
  category: String,
  price: Number,
  old_price: String,
  sellable_online: Boolean,
  link: String,
  other_colors: String,
  short_description: String,
  designer: String,
  depth: Number,
  height: Number,
  width: Number,
});


if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Product.deleteMany();
    ProductData.forEach(singleProduct => {
      const newProduct = new Product(singleProduct);
      newProduct.save();
    })
  }
  resetDataBase();
}

const port = process.env.PORT || 8080;
const app = express();

// Middlewares to enable cors and json body parsing.
app.use(cors());
app.use(express.json());

// First page
// When using sendFile the HTML & CSS files are sent as response...
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
app.get("/style.css", (req, res) => {
  res.sendFile(__dirname + "/style.css");
});
// Alternative first page (without frontend added) displaying list of optional routes
  /*res.send([
    { "/": "StartPage" },
    { "/products": "Display all products" },
    { "/products/name": "Search for a product by name" },
    { "/products/lowestprice": "Display the cheapest products first" },
    { "/products/designer/:designer": "Display all products by designer" },
    { "/products/sellableonline": "Display all products sold online" },
  ]);*/
});

// Display all products
app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({
    success: true,
    body: ProductData
  });
});

// Find product by name
// Example route: /products/name/billy
app.get("/products/name/:name", async (req, res) => {
  try {
    const products = await Product.findOne({ name: req.params.name.toUpperCase() });
    if (products) {
      res.status(200).json({
        success: true,
        body: products
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the product"
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }
});


// Display products by lowest price
app.get("/products/lowestprice/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({price:1});
    if (products) {
      res.status(200).json({
        success: true,
        body: products
        //body: products.sort((a, b) => {
        //  return a.price - b.price;
       // })
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the products"
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }
});

// Find product by designer
// Example route: /products/designer/Francis Cayouette
app.get("/products/designer/:designer", async (req, res) => {
  try {
    const products = await Product.find({ designer: req.params.designer });
    console.log(products)
    if (products) {
      res.status(200).json({
        success: true,
        body: products
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find this designer"
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }
});

// Find only products sold online - NOT YET WORKING
app.get("/products/sellableonline", async (req, res) => {
  try {
    const products = await Product.find({ sellable_online: true });
    console.log(products)
    if (products) {
      res.status(200).json({
        success: true,
        body: products
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find this information"
        }
      });
    }
  } catch (error) {
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

//--------NOTES--------

//RESET_DB=true npm run dev
// Go here:

//https://regex101.com/

// /yourWodOfChoice/gm - regex to match yourWordOfChoice
// /.*/gm - regex to match every character in a string
