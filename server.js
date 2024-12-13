import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import simsData from "./data/sims-npcs.json";
import listEndpoints from "express-list-endpoints";

// Use environment variable for MongoDB connection
const mongoUrl = process.env.MONGO_URL;

// Connect to MongoDB with some basic error handling
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

mongoose.Promise = Promise;

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Define the NPC Schema
const Npc = mongoose.model('Npc', {
  id: String,
  name: String,
  gameVersion: String,
  category: String,
  occupation: String,
  lifeStage: String,
  appearanceMethod: String,
  traits: [String],
  notableFeature: String
});

// Seed database
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      await Npc.deleteMany({});
      await Promise.all(simsData.npcs.map(npcData => {
        const npc = new Npc(npcData);
        return npc.save();
      }));
      console.log("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };
  seedDatabase();
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});