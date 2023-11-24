import MensItemsModel from "../models/MensItem";
import mensWearData from "../data/mens_wear.json";
import express from "express";

const router = express.Router();
const listEndpoints = require("express-list-endpoints");

// Fetch the whole set of data
router.get("/", async (req, res) => {
  res.send(listEndpoints(router));
});

// Fetch all items
router.get("/items", async (req, res) => {
  const items = await MensItemsModel.find()
    .then((items) => res.json(items))
    .catch((error) => res.json({ error: "Item Not found" }));
});

//Get the items which are on promotion
router.get("/promotions", async (req, res) => {
  const items = await MensItemsModel.find({ isPromotion: true })
    .then((items) => res.json(items))
    .catch((error) => res.json({ error: "Item Not found" }));
});

//Get the items which are on promotion & sort them by the best selling item
router.get("/promotions/bestSelling", async (req, res) => {
  const items = await MensItemsModel.find({ isPromotion: true })
    .sort({
      quantity_sold: -1,
    })
    .then((items) => res.json(items))
    .catch((error) => res.json({ error: "Item Not found" }));
});

//Get the items according to the size
//Use "$all" operator together with "find ()" method to find matching value in an array
//If an item only has one of the specified sizes, it won't be included in the result.
//Note: If we want to return size which mactch either one, we can use $in operator
//i.e /size?sizes=S should get all items available in Size S
//i.e /size?sizes=S,XL will return items that are available in both sizes 'S' and 'XL'

router.get("/size", async (req, res) => {
  const sizes = req.query.sizes;
  // assuming the user provides sizes as a comma-separated list in the query parameter
  const sizesArray = sizes.split(",");
  if (!sizes) {
    return res
      .status(400)
      .json({ error: "Please provide the size you would like" });
  }
  const items = await MensItemsModel.find({
    size: { $all: sizesArray },
  });
  res.json(items);
});

//Get items by catagories
router.get("/category/:category", async (req, res) => {
  const items = await MensItemsModel.find({ category: req.params.category });
  if (items) {
    res.json(items);
  } else {
    res.status(404).json({ error: "Item Not found" });
  }
});

export default router;
