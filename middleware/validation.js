// StartDate and EndDate Validation
const existingTrip = await Trip.findOne({
  userID: userId,
  $or: [
    { "tripDate.startDate": { $lt: newEndDate, $gte: newStartDate } },
    { "tripDate.endDate": { $gt: newStartDate, $lte: newEndDate } },
  ],
});
if (existingTrip) {
  throw new Error("Trip dates overlap with an existing trip.");
}

// Validation for hotelBreakfastDays
if (hotelBreakfastDays > totalDays) {
  throw new Error("Hotel breakfast days cannot exceed the total number of trip days.");
}
