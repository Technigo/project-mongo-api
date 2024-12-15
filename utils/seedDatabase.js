import fs from "fs/promises";
import { User } from "../models/userModel.js";
import { Trip } from "../models/tripModel.js";

const users = JSON.parse(await fs.readFile(new URL("../data/users.json", import.meta.url)));
const trips = JSON.parse(await fs.readFile(new URL("../data/trips.json", import.meta.url)));

export const seedDatabase = async () => {
  try {
    // Clear existing collections
    await User.deleteMany({});
    await Trip.deleteMany({});
    console.log("Existing data cleared!");

    // Insert users and get their ObjectIds
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users inserted!`);

    // Map user names to ObjectIds
    const userMap = createdUsers.reduce((map, user) => {
      map[`${user.firstName} ${user.lastName}`] = user._id; // Key: Full name, Value: ObjectId
      return map;
    }, {});

    // Update trips with correct ObjectIds
    const updatedTrips = trips.map((trip) => ({
      ...trip,
      creation: {
        ...trip.creation,
        createdBy: userMap[trip.creation.createdBy], // Replace `createdBy` with ObjectId
      },
      submission: {
        ...trip.submission,
        approvedBy: trip.submission.approvedBy ? userMap[trip.submission.approvedBy] : null, // Replace `approvedBy` with ObjectId or null
      },
    }));

    // Insert trips
    const createdTrips = await Trip.insertMany(updatedTrips);
    console.log(`${createdTrips.length} trips inserted!`);
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error.message);
    throw error; // Re-throw error to handle it in server.js
  }
};
