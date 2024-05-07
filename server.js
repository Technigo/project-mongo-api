import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const { Schema } = mongoose
const cheeseSchema = new Schema({
	id: Number,
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

app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
	res.send('Hello Technigo!')
})

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
