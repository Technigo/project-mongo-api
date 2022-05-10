import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/netflix'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8085
const app = express()

const Title = mongoose.model('Title', {
	show_id: Number,
	title: String,
	director: String,
	cast: String,
	country: String,
	date_added: String,
	release_year: Number,
	rating: String,
	duration: String,
	listed_in: String,
	description: String,
	type: String,
})

if (process.env.RESET_DATABASE) {
	const seedDatabase = async () => {
		await Title.deleteMany()
		netflixData.forEach((singleTitle) => {
			const newTitle = new Title(singleTitle)
			newTitle.save()
		})
	}

	seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
	res.send('Hello Technigo!')
})

// app.get('/authors', async (req, res) => {
// 	const authors = await Author.find()
// 	res.json(authors)
// })

// app.get('/authors/:id', async (req, res) => {
// 	const author = await Author.findById(req.params.id)
// 	if (author) {
// 		res.json(author)
// 	} else {
// 		res.status(484).json({ error: 'Author not found' })
// 	}
// })

// app.get('/authors/:id/books', async (req, res) => {
// 	const author = await Author.findById(req.params.id)
// 	if (author) {
// 		const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
// 		res.json(books)
// 	} else {
// 		res.status(484).json({ error: 'Author not found' })
// 	}
// })

// app.get('/books', async (req, res) => {
// 	const books = await Book.find().populate('author')
// 	res.json(books)
// })

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
