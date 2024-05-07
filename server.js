import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cheeses from './data/cheeses.json'
import expressListEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/CheesusChrist'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

//seed the database
if (process.env.RESET_DATABASE) {
	const seedDatabase = async () => {
		console.log('Resetting and seeding')
		await Cheese.deleteMany()
		cheeses.forEach((cheese) => {
			new Cheese(cheese).save()
		})
	}
	//seedDatabase()
}

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

app.get('/names/:name', async (req, res) => {
	const cheeseName = await Cheese.findOne({ name: req.params.name }).exec()

	if (cheeseName) {
		res.json(cheeseName)
	} else {
		res.status(404).send('cannot find cheese by this name')
	}
})

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
