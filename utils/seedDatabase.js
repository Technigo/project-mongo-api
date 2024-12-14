import { User } from "../models/userModel.js";
import { Trip } from "../models/tripModel.js";
import users from "../data/users.json";
import trips from "../data/trips.json";
import { connectDatabase } from "../config/database.js";
import dotenv from "dotenv";

dotenv.config();

// Check if RESET_DB is set in the environment variables
if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    try {
      // Connect to the database
      await connectDatabase();

      // Clear existing collections
      await User.deleteMany({});
      await Trip.deleteMany({});
      console.log("Existing data cleared!");

      // Insert users and get their ObjectIds
      const createdUsers = await User.insertMany(users);
      console.log(`${createdUsers.length} users inserted!`);

      // Map user names to ObjectIds
      const userMap = createdUsers.reduce((map, user) => {
        map[user.firstName + " " + user.lastName] = user._id;
        return map;
      }, {});

      // Update trips with correct ObjectIds
      const updatedTrips = trips.map((trip) => ({
        ...trip,
        userID: userMap[trip.userID], // Replace userID with ObjectId
        creation: {
          ...trip.creation,
          createdBy: userMap[trip.creation.createdBy], // Replace createdBy with ObjectId
        },
        submission: {
          ...trip.submission,
          approvedBy: userMap[trip.submission.approvedBy] || null, // Replace approvedBy with ObjectId or keep null
        },
      }));

      // Insert trips
      const createdTrips = await Trip.insertMany(updatedTrips);
      console.log(`${createdTrips.length} trips inserted!`);

      console.log("Database seeding completed successfully!");
    } catch (error) {
      console.error("Error seeding the database:", error.message);
    } finally {
      process.exit(); // Exit the process once seeding is complete
    }
  };

  seedDatabase();
} else {
  console.log("RESET_DATABASE is not set. Skipping database seeding.");
}