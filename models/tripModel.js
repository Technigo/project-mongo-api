import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
  title: {
    type: String,
    required: true,
    minlength: [2, "Trip Code must be at least 2 characters long"],
    maxlength: [50, "Trip Code can't be more than 50 characters"],
  },
  location: {
    city: { type: String, required: true },
    country: { type: String }, // Fetched automatically via a geolocation API or lookup table, not required
  },
  tripDate: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },  
  hotelBreakfastDays: { type: Number, default: 0 }, // Validated in middleware
  mileageKm: { type: Number, default: 0 },
  status: {
    type: String,
    required: true,
    enum: ["approved", "awaiting approval", "not submitted"]
  },
  creation: {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
    createdAt: { type: Date, default: Date.now },
  },  
  submission: {
    updatedAt: { type: Date, default: null }, 
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to Admin User
    approvedAt: { type: Date, default: null }, 
  },  
  calculatedData: {
    totalDays: { type: Number}, // Optional, generated from frontend
    totalAmount: { type: Number }, // Optional, generated from frontend
  },    
});

export const Trip = mongoose.model("Trip", tripSchema);