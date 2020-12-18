import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
import goldenGlobesData from './data/golden-globes.json';
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

const Nomination = new mongoose.model('Nomination', {
	year_film: Number,
	year_award: Number,
	ceremony: Number,
	category: String,
	nominee: String,
	film: String,
	win: Boolean,
});

if (process.env.RESET_DATABASE) {
	const populateDatabase = async () => {
		await Nomination.deleteMany();

		goldenGlobesData.forEach((item) => {
			const newNomination = new Nomination(item);
			newNomination.save();
		});
	};
	populateDatabase();
}

// Start defining your routes here
app.get('/nominations', async (req, res) => {
	const allNominations = await Nomination.find();
	res.json(allNominations);
});

//route to a single item

app.get('/nominations/:nominee', async (req, res) => {
	const singleNominee = await Nomination.findOne({
		nominee: req.params.nominee,
	});

	res.json(singleNominee);
});

//single item

// app.get('nominations/', async (req, res) => {
// 	const findOne = await Nomination.findOne();
// 	res.json(findOne);
// });

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
