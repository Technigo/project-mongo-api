import asyncHandler from "express-async-handler";
import restaurantSchema from "../models/restaurant";

// @desc		Get restaurants
// @route		GET /restaurants
// @access	Private
const getRestaurants = asyncHandler(async (req, res) => {
  const { name, city, area, price, category } = req.query;
  let queries = {};

  if (name) {
    queries.name = name;
  }
  if (city) {
    queries.city = city;
  }
  if (area) {
    queries.area = area;
  }
  if (price) {
    queries.price = price;
  }
  if (category) {
    queries.category = category;
  }

  const restaurants = await restaurantSchema.find(queries);

  res.status(200).json(restaurants);
});

// @desc		Get restaurant by id
// @route		GET /restaurants/:id
// @access	Private
const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await restaurantSchema.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  res.status(200).json(restaurant);
});

// @desc		Set restaurant
// @route		POST /restaurants
// @access	Private
const setRestaurant = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(404);
    throw new Error("Please add a body");
  }

  const restaurant = await restaurantSchema.create({
    name: req.body.name,
    city: req.body.city,
    area: req.body.area,
    price: req.body.price,
    category: req.body.category,
  });
  res.status(201).json(restaurant);
});

// @desc		Update restaurant
// @route		PUT /restaurants/:id
// @access	Private
const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await restaurantSchema.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  const updatedRestaurant = await restaurantSchema.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedRestaurant);
});

// @desc		Delete restaurant
// @route		DELETE /restaurants/:id
// @access	Private
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await restaurantSchema.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }
  await restaurant.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getRestaurants,
  getRestaurant,
  setRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
