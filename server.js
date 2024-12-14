import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import simsData from "./data/sims-npcs.json";
import listEndpoints from "express-list-endpoints";
import dotenv from 'dotenv';

// Configure dotenv to use .env file
dotenv.config();

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

// API Documentation endpoint
app.get("/", (req, res) => {
  const documentation = {
    Welcome: "Welcome to the Sims NPCs API!",
    Endpoints: listEndpoints(app).map((endpoint) => {
      return {
        path: endpoint.path,
        methods: endpoint.methods,
        middlewares: endpoint.middlewares,
      }
    }),
    QueryParameters: {
      gameVersion: "Filter NPCs by game version (e.g., '4')",
      lifeStage: "Filter NPCs by life stage",
      category: "Filter NPCs by category",
      sorted: "Sort NPCs by name (true/false)"
    }
  }
  res.json(documentation)
});

// Get all NPCs with query parameters
app.get("/npcs", async (req, res) => {
  const { sorted, gameVersion, lifeStage, category } = req.query;

  try {
    // Build query object
    const query = {};

    if (gameVersion) {
      query.gameVersion = { $regex: `The Sims ${gameVersion}`, $options: "i" };
    }

    if (lifeStage) {
      query.lifeStage = { $regex: lifeStage, $options: "i" };
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // Execute query
    let npcsQuery = Npc.find(query);

    // Add sorting if requested
    if (sorted === 'true') {
      npcsQuery = npcsQuery.sort({ name: 1 });
    }

    const npcs = await npcsQuery;

    res.json({
      success: true,
      count: npcs.length,
      results: npcs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single NPC by ID
app.get("/npcs/:id", async (req, res) => {
  try {
    const npc = await Npc.findOne({ id: req.params.id });
    
    if (!npc) {
      return res.status(404).json({ 
        success: false, 
        error: 'NPC not found' 
      });
    }

    res.json({
      success: true,
      data: npc
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});