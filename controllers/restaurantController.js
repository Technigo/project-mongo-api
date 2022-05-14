import asyncHandler from "express-async-handler";
import Restaurant from "../models/restaurant";

// @desc		Get restaurants
// @route		GET /api/restaurants
// @access	Private
const getRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find();
  const name = req.query.name;
  const city = req.query.city;

  // query specific restaurant by name
  if (name) {
    const restaurant = restaurants.find((item) => item.name === name);
    restaurant ? res.status(200).json(restaurant) : res.status(404).json("Not found");
  }

  // query restaurants by city
  if (city) {
    const restaurantsByCity = restaurants.filter((item) => item.city === city);
    res.status(200).json(restaurantsByCity);
  }

  res.status(200).json(restaurants);
});

// @desc		Get restaurant by id
// @route		GET /api/restaurants
// @access	Private
const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  res.status(200).json(restaurant);
});

// @desc		Set restaurant
// @route		POST /api/restaurants
// @access	Private
const setRestaurant = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400);
    throw new Error("Please add a body");
  }

  const restaurant = await Restaurant.create({
    name: req.body.name,
    city: req.body.city,
    area: req.body.area,
    price: req.body.price,
    category: req.body.category,
  });
  res.status(200).json(restaurant);
});

// @desc		Update restaurant
// @route		PUT /api/restaurants/:id
// @access	Private
const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(400);
    throw new Error("Restaurant not found");
  }

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedRestaurant);
});

// @desc		Delete restaurant
// @route		DELETE /api/restaurants/:id
// @access	Private
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(400);
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
