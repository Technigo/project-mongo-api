import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import harryPotterCharactersData from "./data/harry-potter-characters.json";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/harrypottercharacters";
mongoose.connect(mongoUrl);

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

if (process.env.RESET_DB) {
	const seedDatabase = async () => {
		await HarryPotterCharacter.deleteMany({});
		harryPotterCharactersData.forEach((character) => {
			const newCharacter = new HarryPotterCharacter(character);
			newCharacter.save();
		});
	};
	seedDatabase();
};


// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
	res.send("Welcome to the Harry Potter API!");
});

app.get("/harryPotterCharacters", async (req, res) => {
	const { house, role, yearIntroduced } = req.query; // Extracting query params 

	// Creating a dynamic query object to be able to filter on more than one thing at the time
	const query = {};
	if (house) query.house = new RegExp(house, "i"); // "i" stands for case-insensitive matching: eg. makes the regular expression ignore differences between uppercase and lowercase letters when matching strings.
	if (role) query.role = new RegExp(role, "i");
	if (yearIntroduced) query.yearIntroduced = +yearIntroduced;

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
	const { id } = req.params;

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

//finding only the name 
app.get("/harryPotterCharacters/name/:name", async (req, res) => {
	const name = req.params.name;

	try {
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
