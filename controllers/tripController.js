import { Trip } from "../models/tripModel.js";

// GET all trips
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a specific trip by ID
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("creation.createdBy").populate("submission.approvedBy");
    if (!trip) {
      return res.status(404).json({ message: "Trip not found." });
    }
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new trip
export const createTrip = async (req, res) => {
  const trip = await new Trip(req.body).save();

  try {
    res.status(201).json({
      success: true,
      response: trip,
      message: "Trip is created"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error.message,
      message: "Trip can't be created"
    });
  }
};

// PATCH (Partial Update) an existing trip
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensure validation runs for updates
    });

    if (!trip) {
      return res.status(404).json({
      success: false,
      message: "Trip didn't found. Please add one."
    });
    }
    
    res.status(200).json({
      success: true,
      response: trip,
      message: "Trip updated success"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error.message,
      message: "Trip can't be updated. Please check again"
    });
  }
};

// PUT (Full Replace) - using findOneAndReplace
export const updateTripPut = async (req, res) => {
  try {
    const trip = await Trip.findOneAndReplace(
      { _id: req.params.id },
      req.body,
      {
      new: true, // Return the updated document
      overwrite: true, // Overwrite the entire document
      runValidators: true, // Enforce validation rules
    });

    if (!trip) {
      return res.status(404).json({
      success: false,
      message: "Trip didn't found. Please add one."
    });
    }
    
    res.status(200).json({
      success: true,
      response: trip,
      message: "Trip updated success"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error.message,
      message: "Trip can't be updated. Please check again"
    });
  }
};


