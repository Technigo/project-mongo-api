import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import harryPotterCharactersData from "./data/harry-potter-characters.json";

dotenv.config();

//using the Atlas URL from .env, or fall back to local MongoDB localhost
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/harrypottercharacters";
mongoose.connect(mongoUrl);

// Defining a Mongoose model for a Harry Potter character
const HarryPotterCharacter = mongoose.model("HarryPotterCharacter", {
	id: Number,
	name: String,
	house: String,
	role: String,
	rating: Number,
	yearIntroduced: Number
});

const port = process.env.PORT || 9000;
const app = express();

// If the RESET_DB environment variable is true, the database is seeded with JSON data
if (process.env.RESET_DB) {
	const seedDatabase = async () => {
		await HarryPotterCharacter.deleteMany({}); // Clears the existing database
		harryPotterCharactersData.forEach((character) => {
			const newCharacter = new HarryPotterCharacter(character); // Creating a new character instance
			newCharacter.save();
		});
	};
	seedDatabase();
};


// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Middleware to handle 503 errors
app.use((req, res, next) => {
	if (mongoose.connection.readyState === 1) {
		next()
	} else {
		res.status(503).json({ error: "Service unavailable" });
	}
});

// Start defining your routes here (added listEndpoints)
app.get("/", (req, res) => {
	res.json({
		message: "Welcome to the Harry Potter API!",
		routes: listEndpoints(app),
	});
});

app.get("/harryPotterCharacters", async (req, res) => {
	const { house, role, yearIntroduced } = req.query; // Extracting query params 

	// Creating a dynamic query object to be able to filter on more than one thing at the time
	const query = {}; //Initially an empty query object before the user has applied filters
	if (house) query.house = new RegExp(house, "i"); //Depending on the query parameters provided - properties are dynamically added to the query object. 
	if (role) query.role = new RegExp(role, "i");
	if (yearIntroduced) query.yearIntroduced = +yearIntroduced;
	// "i" stands for case-insensitive matching: eg. makes the regular expression ignore differences between uppercase and lowercase letters when matching strings.
	try {
		// Query MongoDB using the dynamic query object
		const characters = await HarryPotterCharacter.find(query);

		if (characters.length === 0) {
			res.status(404).json({ message: "Sorry - no characters found" });
		} else {
			res.json(characters);
		}
	} catch (error) {
		res.status(400).json({ error: "Server error" });
	}
});


app.get("/harryPotterCharacters/:id", async (req, res) => {
	const { id } = req.params; // Extracting the id from the URL

	try {
		// Converting the string to ObjectId using "new"
		const character = await HarryPotterCharacter.findById(new mongoose.Types.ObjectId(id));
		if (character) {
			res.status(200).json(character);
		} else {
			res.status(404).send("Character not found");
		}
	} catch (error) {
		res.status(400).json({ error: "Invalid ID format or server error", details: error.message });
	}
});

//finding the unique character name 
app.get("/harryPotterCharacters/name/:name", async (req, res) => {
	const name = req.params.name; // Extracting the name from the URL

	try { // "new RegExp(`^${name}$`, "i")" ensures case-insensitive matching 
		const harryPotterCharacterName = await HarryPotterCharacter.findOne({ name: new RegExp(`^${name}$`, "i") });
		if (harryPotterCharacterName) {
			res.status(200).json(harryPotterCharacterName);
		} else {
			res.status(404).send("Sorry - no character found with that name");
		}
	} catch (error) {
		res.status(400).json({ error: "Server error" });
	}
});


// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
