import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import albums from "./data/albums.json";
import errorMsg from "./assets/errormsg.json";
import dotenv from "dotenv";

/*ENVIRONMENT VARIABLES*/
require("dotenv").config();

/*Database */
const mongoUrl =
	process.env.MONGO_URL ||
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.qxpka.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

/*Model for the album object*/
const Album = mongoose.model("Album", {
	number: Number,
	year: Number,
	album: String,
	artist: String,
	genre: String,
	subgenre: String,
});

/*Seed the database if the environment variable reset_tdb is true*/
if (process.env.RESET_DB) {
	const seedDatabase = async () => {
		await Album.deleteMany({});
		albums.forEach((albumData) => {
			new Album(albumData).save();
		});
	};
	seedDatabase();
}

/*API*/
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());
const myEndpoints = require("express-list-endpoints");

/*List all of the endpoints on / */
app.get("/", (req, res) => {
	res.send(myEndpoints(app));
});

/*COLLECTIONS*/
//Get all the albums from the database .
app.get("/api/albums", async (req, res) => {
	const filterYear = req.query.year;
	const filterArtist = req.query.artist;
	const filterGenre = req.query.genre;
	const filterYearTo = req.query.yearTo;
	const filterYearFrom = req.query.yearFrom;
	const noFilters =
		!filterYear &&
		!filterArtist &&
		!filterGenre &&
		!filterYearTo &&
		!filterYearFrom
			? true
			: false;

	const page = req.query.page || 1;
	const pageSize = 50;
	const skipIndex = pageSize * (page - 1);

	const sortBy = req.query.sortBy;
	const sortOrder = req.query.sortOrder;
	let sortQuery = { number: 1 };

	let artistFilter = null;
	let yearFilter = null;
	let genreFilter = null;
	let yearToFilter = null;
	let yearFromFilter = null;
	let filterArray = [];

	//Check if there are sorting parameters in the query. If not, the default is used. If only one param, the other param is default.
	if (sortBy || sortOrder) {
		const querySortBy = !sortBy ? "number" : sortBy.toLowerCase();
		const querySortOrder = !sortOrder ? 1 : sortOrder;
		sortQuery = { [querySortBy]: querySortOrder };
	}

	if (noFilters) {
		const albumsData = await Album.find()
			.sort(sortQuery)
			.skip(skipIndex)
			.limit(pageSize);
		const albumsTotalCount = await Album.find()
			.sort(sortQuery)
			.countDocuments();

		//Create an albumsdata object with additional information
		if (albumsData.length > 0) {
			const returnObj = {
				albumsTotalCount: albumsTotalCount,
				albumsReturned: albumsData.length,
				pageSize: pageSize,
				page: page,
				results: albumsData,
			};
			res.json(returnObj);
		} else {
			res.status(404).send(errorMsg);
		}
	}

	if (!noFilters) {
		if (filterArtist) {
			artistFilter = { artist: filterArtist };
			filterArray.push(artistFilter);
		}
		if (filterYear) {
			yearFilter = { year: filterYear };
			filterArray.push(yearFilter);
		}
		if (filterGenre) {
			genreFilter = { genre: filterGenre };
			filterArray.push(genreFilter);
		}
		//Range cannot be used in combination with exact.
		if (filterYearFrom && !filterYear) {
			yearFromFilter = { year: { $gte: filterYearFrom } };
			filterArray.push(yearFromFilter);
		}

		if (filterYearTo && !filterYear) {
			yearToFilter = { year: { $lte: filterYearTo } };
			filterArray.push(yearToFilter);
		}

		//Using collation with strength 2 to ignore case in search.
		const albumsDataFiltered = await Album.find({ $and: filterArray })
			.collation({ locale: "en", strength: 2 })
			.sort(sortQuery)
			.skip(skipIndex)
			.limit(pageSize);

		const albumsTotalMatchCount = await Album.find({ $and: filterArray })
			.collation({ locale: "en", strength: 2 })
			.countDocuments();

		if (albumsDataFiltered.length > 0) {
			const returnObj = {
				albumsTotalCount: albumsTotalMatchCount,
				albumsReturned: albumsDataFiltered.length,
				pageSize: pageSize,
				page: page,
				filters: filterArray,
				results: albumsDataFiltered,
			};
			res.json(returnObj);
		} else {
			res.status(404).send(errorMsg);
		}
	}
});

//Get top10 albums
app.get("/api/albums/top10", async (req, res) => {
	const topTenAlbums = await Album.find().sort({ number: 1 }).limit(10);
	if (topTenAlbums.length > 0) {
		res.json(topTenAlbums);
	} else {
		res.status(404).send(errorMsg);
	}
});

//Get bottom10 albums
app.get("/api/albums/bottom10", async (req, res) => {
	const bottomTenAlbums = await Album.find().sort({ number: -1 }).limit(10);
	if (bottomTenAlbums.length > 0) {
		res.json(bottomTenAlbums);
	} else {
		res.status(404).send(errorMsg);
	}
});

/*SINGLE ITEMS*/
//Get by placement in list
app.get("/api/albums/placement/:placement", async (req, res) => {
	const placement = req.params.placement;
	console.log(placement);
	const singleAlbumFiltered = await Album.findOne({ number: placement });
	if (singleAlbumFiltered) {
		res.json(singleAlbumFiltered);
	} else {
		res.status(404).send(errorMsg);
	}
});

//Get by album title
app.get("/api/albums/title/:title", async (req, res) => {
	const title = req.params.title.replaceAll("+", " ");
	console.log(title);
	const singleAlbumFiltered = await Album.findOne({ album: title }).collation({
		locale: "en",
		strength: 2,
	});

	if (singleAlbumFiltered) {
		res.json(singleAlbumFiltered);
	} else {
		res.status(404).send(errorMsg);
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
