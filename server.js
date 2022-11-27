import express from "express";
import cors from "cors";
import mongoose from "mongoose";
 import boardGamesDataset from "./data/board-games.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


//model
const BoardGame = mongoose.model("BoardGame", {
    "ID": Number,
    "Name": String,
    "Year_Published": Number,
    "Min_Players": Number,
    "Max_Players": Number,
    "Play_Time": Number,
    "Min_Age": Number,
    "Users_Rated": Number,
    "Rating_Average": String,
    "BGG_Rank": Number,
    "Complexity_Average": String,
    "Owned_Users": Number,
    "Mechanics": String,
    "Domains": String
});

if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await BoardGame.deleteMany();
    boardGamesDataset.forEach(singleGame => {
      const newGame = new BoardGame(singleGame);
      newGame.save();
    })
  }
  resetDataBase();
}

// Defines the port the app will run on. 
const port = process.env.PORT || 8080;
const app = express();

// middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// checks if database is connected. If not, it sends an error message
app.use((req, res, next) => {
if(mongoose.connection.readyState === 1) {
  next()
} else {
  res.status(503).json({error: 'service unavailable'})
}
});

// Show all available routes
app.get("/", (req, res) => {
  res.send([
    {"/": "Shows routes"},
    {"/games": "Displays all games"},
    {"/games/id/:id": "Shows game by _id"},
    {"/games/names/:Name": "Shows game by name (case insensitive)"},
    {"/games/best": "Shows 10 best games (by BGG rank)"},
    {"/games/mechanics/:Mechanics": "Shows game by game mechanics (case insensitive)"},
    {"/games/domains/:Domains": "Filters by domain and then by mechanics (case insensitive)"},
    {"/games/minimum/2": "Shows all games with a minimum of 2 players"}
  ]);
});

// Get all games
app.get("/games", async (req, res) => {
  const allGames = await BoardGame.find({})
 res.status(200).json({
  success: true,
  data: allGames
 })
});

// Shows game by ID
app.get("/games/id/:ID", async (req, res) => {
  try {
    const singleGame = await BoardGame.findById(req.params.ID);
    if(singleGame) {
      res.status(200).json({
        success: true,
        data: singleGame
       })
    } else {
      res.status(404).json({
        success: false,
        data: { message: 'could not find'}
       })}} catch {
      res.status(400).json({
      success: false,
      data: {message: 'Bad request'} })} 
});

// Find one by name
app.get("/games/names/:Name", async (req, res) => {
  try {

    const NameRegex = new RegExp(req.params.Name, "i");
  const gameName = await BoardGame.find({ Name: NameRegex })
    if(gameName.length !== 0) {
      res.status(200).json({
        success: true,
        data: gameName
       })
    } else {
      res.status(404).json({
        success: false,
        data: { message: 'could not find'}
       })}} catch {
      res.status(400).json({
      success: false,
      data: {message: 'Bad request'} })} 
});

// Show 10 best game by rating (BGG rank)
app.get("/games/best/", async (req, res) => {
  try {
    const gameRating = await BoardGame.find({BGG_Rank: {$lte: 10} }).limit(10).sort({BGG_Rank: 1});
    if(gameRating.length !== 0) {
      res.status(200).json({
        success: true,
        data: gameRating
       })
    } else {
      res.status(404).json({
        success: false,
        data: { message: 'could not find'}
       })}} catch {
      res.status(400).json({
      success: false,
      data: {message: 'Bad request'} })} 
});

// Find game by game mechanics (case insensitive)
app.get("/games/mechanics/:Mechanics", async (req, res) => {
  try {

    const MechanicsRegex = new RegExp(req.params.Mechanics, "i");
  const mechanics = await BoardGame.find({ Mechanics: MechanicsRegex })
    if(mechanics.length !== 0) {
      res.status(200).json({
        success: true,
        data: mechanics
       })
    } else {
      res.status(404).json({
        success: false,
        data: { message: 'could not find'}
       })}} catch {
      res.status(400).json({
      success: false,
      data: {message: 'Bad request'} })} 
});

//Filters by domain and then by mechanics
// example http://localhost:8080/games/domains/thematic?Mechanics=Line of sight
app.get("/games/domains/:Domains", async (req, res) => {
  try{
    const DomainsRegex = new RegExp(req.params.Domains, "i");
    const MechanicsRegex = new RegExp(req.query.Mechanics, "i")
    const Dom = await BoardGame.find({ 
      Domains: DomainsRegex,
      Mechanics: MechanicsRegex
  })
    
  if(Dom.length !== 0){
      res.json({
        data: Dom,
        success: true,
      })
  } else {
      res.status(404).json({
        success: false,
        data: {
          message: "Could not found"
        }})
      }
    } catch(error){
      res.status(400).json({
        success: false,
        data: {
          message: "bad request"
      }})
    }
})

// Show games with a minimum of 2 or more players
app.get("/games/minimum/2", async (req, res) => {
  try {
    const minimum  = await BoardGame.find({Min_Players:{$gte: 2} })
    if(minimum) {
      res.status(200).json({
        success: true,
        data: minimum
       })
    } else {
      res.status(404).json({
        success: false,
        data: { message: 'Could not find'}
       })}} catch {
      res.status(400).json({
      success: false,
      data: {message: 'Bad request'} })} 
});


// Starts the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
