# project-mongo-api folder structure
├── data/
│   ├── trips.json
│   ├── users.json
├── middleware/
│   ├── validation.js       # Validation middleware using express-validator
│   ├── auth.js             # Placeholder for authentication logic (optional)
│   ├── errorHandler.js     # Global error handling middleware
├── models/
│   ├── userModel.js             # Mongoose schema for users
│   ├── tripModel.js             # Mongoose schema for trips
├── routes/
│   ├── userRoutes.js       # Routes for user-related API endpoints
│   ├── tripRoutes.js       # Routes for trip-related API endpoints
├── controllers/
│   ├── userController.js   # Handlers for user-related requests
│   ├── tripController.js   # Handlers for trip-related requests
├── utils/
│   ├── seedDatabase.js     # Script to seed JSON data into MongoDB
├── config/
│   ├── database.js         # Database connection setup
│   ├── dateValidators.js   # put all date-related utilities (validation, calculation)
├── .env                    # Environment variables (e.g., MONGO_URL, PORT)
├── .gitignore              # Exclude sensitive and unnecessary files
├── server.js               # Entry point for the API
├── app.js
├── package.json


# Implementation Plan
# # Step 1: Centralize MongoDB Connection Logic
  Create config/database.js with connectDatabase function to manage MongoDB connections.
# # Step 2: Setup Database Connection
    Import this file into server.js to ensure the app connects to the database at startup.
# # Step 3: Create Mongoose Models
  Define User and Trip schemas in the models/ folder.
  Ensure schemas align with the structure of users.json and trips.json.
# # Step 4: Seed the Database
  Create utils/seedDatabase.js to populate MongoDB with users.json and trips.json
# # Step 5: Add Routes
  Split routes into routes/userRoutes.js and routes/tripRoutes.js.
  Implement basic GET, POST, and PUT endpoints for users and trips.
# # Step 6: Add Controllers
  Create corresponding controllers in the controllers/ folder.
  Each controller should handle logic for the routes.
# # Step 7: Add Middleware
  Validation Middleware: Validate input data for creating or updating users and trips.
  Error Handler Middleware: Add centralized error handling.
# # Step 8: Test API with Postman
  Create a Postman collection for testing each endpoint.
  Verify the API works as expected for GET, POST, and PUT requests.