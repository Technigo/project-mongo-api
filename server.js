import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import charactersPotter from "./data/characters.json";
import spellsPotter from "./data/spells.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})


const { Schema } = mongoose;

const charactersSchema = new mongoose.Schema({
  "Character ID": Number,
  "Character Name": String,
  Species: String,
  Gender: String,
  House: String,
  Patronus: String,
  "Wand (Wood)": String,
  "Wand (Core)": String
});

const Characters = mongoose.model("Characters", charactersSchema);

const spellsSchema = new mongoose.Schema({
  "Spell ID": Number,
  Incantation: String,
  "Spell Name": String,
  Effect: String,
  Light: String
})

const Spells = mongoose.model("Spells", spellsSchema);



if (process.env.RESET_DATABASE) {
  const resetDatabase = async () => {
    await Characters.deleteMany();
    await Spells.deleteMany();
    charactersPotter.forEach((singleCharacter) => {
      const newCharacter = new Characters(singleCharacter);
      newCharacter.save()
    });
    spellsPotter.forEach((singleSpell) => {
      const newSpell = new Spells(singleSpell)
      newSpell.save()
    })
  }
  resetDatabase();
}



// Start defining your routes here
app.get("/", (req, res) => {
  const navigation = {
    guide: "Routes for Harry Potter API",
    Endpoints: [
      {
        "/characters": "Display all Characters from Harry Potter Movies",
        "/characters/ID/:ID": "Search specific Character id",
        "/characters/name/:name": "Search for a name in Harry Potter Movies",
        "/spells": "Display all spells"
      },
    ],
  };
  res.send(navigation);
});



app.get("/characters", async (req, res) => {
  try {
    res.json(charactersPotter)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/spells", async (req, res) => {
  try {
    res.json(spellsPotter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" })
  }
});


app.get("/characters/ID/:ID", async (req, res) => {
  try {
    const singleCharacter = await Characters.findById(req.params.ID);
    if (singleCharacter) {
      res.status(200).json({
        success: true,
        body: singleCharacter      
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Character not found"
        } 
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

app.get("/characters/name/:name", async (req, res) => {
  try {
    const characters = await Characters.find({
      "Character Name": { $regex: req.params.name, $options: "i" }
    });
    if (characters.length === 0) {
      res.status(404).json({ message: "No characters found" });
    } else {
      res.json(characters);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
