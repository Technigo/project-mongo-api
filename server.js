import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import pokeRoutes from './routes/pokemons'
import typeRoutes from './routes/types'

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use('/poke/', pokeRoutes)
app.use('/types/', typeRoutes)

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
