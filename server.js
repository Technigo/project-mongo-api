import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import harryPotterCharactersData from "./data/harry-potter-characters.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/harrypottercharacters";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

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
	const { house, role, yearIntroduced } = req.query; // Extracting query parameters 

	// Creating a dynamic query object to be able to filter on more than one thing at the time
	const query = {};
	if (house) query.house = new RegExp(house, "i"); // "i" stands for case-insensitive matching: eg. makes the regular expression ignore differences between uppercase and lowercase letters when matching strings.
	if (role) query.role = new RegExp(role, "i");
	if (yearIntroduced) query.yearIntroduced = +yearIntroduced;

	try {
		// Query MongoDB using the dynamic query object
		const characters = await HarryPotterCharacter.find(query);

		if (characters.length === 0) {
			res.status(404).json({ message: "No characters found matching the criteria." });
		} else {
			res.json(characters);
		}
	} catch (error) {
		res.status(500).json({ error: "Server error", details: error.message });
	}
});


app.get("/harryPotterCharacters/:id", async (req, res) => {
	const id = req.params.id;

	try {
		const harryPotterCharacter = await HarryPotterCharacter.findOne({ id: +id }); // Using +id to reassure the id is always read as a number 
		if (harryPotterCharacter) {
			res.status(200).json(harryPotterCharacter);
		} else {
			res.status(404).send("Sorry - no character found with that ID");
		}
	} catch (error) {
		res.status(500).json({ error: "Server error", details: error.message });
	}
});


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
		res.status(500).json({ error: "Server error", details: error.message });
	}
});


// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
