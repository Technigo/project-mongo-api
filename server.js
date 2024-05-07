import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cheeses from './data/cheeses.json'
import expressListEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/CheesusChrist'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

//seed the database
const seedDatabase = () => {
	cheeses.forEach((cheese) => {
		new Cheese(cheese).save()
	})
}
seedDatabase()

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

app.get('/cheeses', (req, res) => {
	res.json(cheeses)
})

app.get('/cheeses/:cheeseId', async (req, res) => {
	try {
		const cheeseId = await Cheese.findById(req.params.cheeseId).exec()

		if (cheeseId) {
			res.send(cheeseId)
		} else {
			res.status(404).send('this cheese does not exist')
		}
	} catch (error) {
		res.status(500).send('Internal server error')
	}
})

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
