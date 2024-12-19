import { Trip } from "../models/tripModel.js";

/**
 * Check for overlapping trips in the database.
 * userID - ID of the user.
 * startDate - Start date of the trip.
 * endDate - End date of the trip.
 * {Promise} - Resolves if no overlap, rejects otherwise.
 */

export const checkOverlappingTrips = async (userID, startDate, endDate) => {
  const overlappingTrip = await Trip.findOne({
    userID: userID,
    $or: [
      // Check if new startDate falls within an existing trip
      { "tripDate.startDate": { $lte: new Date(startDate) }, "tripDate.endDate": { $gte: new Date(startDate) } },
      // Check if new endDate falls within an existing trip
      { "tripDate.startDate": { $lte: new Date(endDate) }, "tripDate.endDate": { $gte: new Date(endDate) } },
    ],
  });
  return overlappingTrip;
};

/**
 * Validate that endDate is after startDate.
 * startDate - Start date of the trip.
 * endDate - End date of the trip.
 * {Error} - Throws an error if endDate is not after startDate.
 */

export const validateEndDateAfterStartDate = (startDate, endDate) => {
  if (new Date(endDate) <= new Date(startDate)) {
    throw new Error("endDate must be after startDate.");
  }
};

/**
 * Calculate the total days of a trip, accounting for partial days.
 * startDate - Start date and time of the trip.
 * endDate - End date and time of the trip.
 * {Number} - Total days of the trip (including 0.5 for partial days).
 */

export const calculateTotalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the total number of full days between the dates
  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));

  // Check start time (add 0.5 if it starts after 12 PM)
  const startDayPartial = start.getHours() >= 12 ? 0.5 : 1;

  // Check end time (add 0.5 if it ends before 12 PM)
  const endDayPartial = end.getHours() < 12 ? 0.5 : 1;

  return totalDays + startDayPartial + endDayPartial;
};
