import { body, validationResult } from "express-validator";
import { checkOverlappingTrips, validateEndDateAfterStartDate, calculateTotalDays } from "../utils/dateValidators.js";

// Validation rules for creating or updating a user
export const validaterUser = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("role")
    .trim()
    .isIn(["admin", "co-worker"])
    .withMessage("Role must be either 'admin' or 'co-worker'."),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Phone number must be a valid mobile number."),  
]

// Validation rules for creating or updating a trip
export const validateTrip = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required."),
  
  body("location.city")
    .trim()
    .notEmpty()
    .withMessage("City is required."),
  
  // Validate startDate
  body("tripDate.startDate")
    .isISO8601()
    .withMessage("Valid startDate is required.")
    .bail() // Stop further validation if this fails
    .custom(async (startDate, { req }) => {
      const { userID, tripDate } = req.body;
      const endDate = tripDate?.endDate;

      // Check for overlapping trips
      const overlappingTrip = await checkOverlappingTrips(userID, startDate, endDate);
      if (overlappingTrip) {
        throw new Error("The trip overlaps with an existing trip.");
      }
      return true;
    }),

  // Validate endDate
  body("tripDate.endDate")
    .isISO8601()
    .withMessage("Valid endDate is required.")
    .bail()
    .custom((endDate, { req }) => {
      const startDate = req.body.tripDate?.startDate;
      if (startDate) {
        validateEndDateAfterStartDate(startDate, endDate);
      }
      return true;
    }),
  
  // Validate hotelBreakfastDays
  body("hotelBreakfastDays")
    .isInt({ min: 0 })
    .withMessage("Hotel breakfast days must be a positive integer.")
    .bail()
    .custom((hotelBreakfastDays, { req }) => {
      const startDate = req.body.tripDate?.startDate;
      const endDate = req.body.tripDate?.endDate;

      if (startDate && endDate) {
        const totalDays = calculateTotalDays(startDate, endDate);

        if (hotelBreakfastDays > totalDays) {
          throw new Error(
            `Hotel breakfast days (${hotelBreakfastDays}) cannot exceed the total number of trip days (${totalDays}).`
          );
        }
      }
      return true;
    }),
  
  // Validate status
  body("status")
    .isIn(["approved", "awaiting approval", "not submitted"])
    .withMessage("Status must be 'approved', 'awaiting approval', or 'not submitted'."),
];

// General validation handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};