import express from "express";
import cors from "cors";
// import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/usersExample";
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = Promise;

// const User = mongoose.model('User', {
//   name: String
// })

// User.deleteMany().then(() => {
//   new User({ name: 'Bob' }).save()
//   new User({ name: 'Jane' }).save()
//   new User({ name: 'Rebecca' }).save()
//   new User({ name: 'Steve' }).save()
// })


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   if (mongoose.connection.readyState === 1) {
//     next()
//   } else {
//     res.status(503).json({ error: 'Service unavailable'})
//   }
// })

// Start defining your routes here

// app.get("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//     if (user) {
//       res.json(user)
//     } else {
//       res.status(404).json({ error: 'User not found'})
//     }
//   } catch (err) {
//     res.status(400).json({ error: 'Invalid user id' })
//   }
  
  
// });

app.get('/', (req, res) => {
  // fetch('...', { headers: { Authorization: 'my secret api key' }})
  res.send('process.env.API_KEY')
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
