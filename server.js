import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cheeses from './data/cheeses.json'
import expressListEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/CheesusChrist'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise


const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

const { Schema } = mongoose
const cheeseSchema = new Schema({
	name: String,
	animal: String,
	region: String,
	taste: String,
	wine_pairing: String,
	cheese_rating: Number,
	wine_pairing_rating: Number,
})

//models
const Cheese = mongoose.model('Cheese', cheeseSchema)

//seed the database
if (process.env.RESET_DATABASE) {
	const seedDatabase = async () => {
		console.log('Resetting and seeding')
		await Cheese.deleteMany()
		cheeses.forEach((cheese) => {
			new Cheese(cheese).save()
		})
	}
	seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
	const endpoints = expressListEndpoints(app)
	res.json(endpoints)
})

//route to get all cheeses
app.get('/cheeses', async (req, res) => {
	const allTheCheeses = await Cheese.find()

	if (allTheCheeses.length > 0) {
		res.json(allTheCheeses)
	} else {
		res.status(404).send('No cheeses where found')
	}
})

//route to get cheese by id
app.get('/cheeses/:cheeseId', async (req, res) => {
	const { cheeseId } = req.params

	const cheese = await Cheese.findById(cheeseId).exec()

	if (cheese) {
		res.send(cheese)
	} else {
		res.status(404).send('this cheese does not exist')
	}
})

//route that shows a single cheese by name if you enter it in the URL
app.get('/names/:name', async (req, res) => {
	const cheeseName = await Cheese.findOne({ name: req.params.name }).exec()

	if (cheeseName) {
		res.json(cheeseName)
	} else {
		res.status(404).send('cannot find cheese by this name')
	}
})

//
app.get('/regions', async (req, res) => {
	const regions = await Cheese.find({})

	if (regions) {
		res.json(regions)
	} else {
		res.status(404).send('no regions found')
	}
})

//router that finds all the cheeses made from cows milk
app.get('/cows', async (req, res) => {
	const cowMilk = await Cheese.find({ animal: 'Cow' })

	if (cowMilk) {
		res.json(cowMilk)
	} else {
		res.status(404).send('could not find cheeses made from cows milk')
	}
})

//router that finds all the cheeses made from goat milk
app.get('/goats', async (req, res) => {
	const goatMilk = await Cheese.find({ animal: 'Goat' })

	if (goatMilk) {
		res.json(goatMilk)
	} else {
		res.status(404).send('could not find cheeses made from goat milk')
	}
})

//router that finds all the cheeses made from sheep milk
app.get('/sheep', async (req, res) => {
	const sheepMilk = await Cheese.find({ animal: 'Sheep' })

	if (sheepMilk) {
		res.json(sheepMilk)
	} else {
		res.status(404).send('could not find cheeses made from goat milk')
	}
})

//router to show the wines
app.get('/wines', async (req, res) => {
	const wines = await Cheese.find(
		{ wine_pairing: { $ne: null } },
		'wine_pairing'
	)
	if (wines && wines.length > 0) {
		res.json(wines)
	} else {
		res.status(404).send('Could not find wines')
	}
})

//router that shows cheese based on rating, b-a
app.get('/bestCheeses', async (req, res) => {
	const allTimeFaves = await Cheese.find().sort({ cheese_rating: -1 })
	if (allTimeFaves) {
		res.json(allTimeFaves)
	} else {
		res.status(404).send('could not find and sort by highest rating')
	}
})

//router that shows cheese based on rating, b-a
app.get('/bestWinePairings', async (req, res) => {
	const cheeseAndWine = await Cheese.find().sort({ wine_pairing_rating: -1 })
	if (cheeseAndWine) {
		res.json(cheeseAndWine)
	} else {
		res.status(404).send('could not show the best wine and cheese pairing')
	}
})

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
