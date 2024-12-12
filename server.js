import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import res from "express/lib/response";

const port = process.env.PORT || 9000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo-api";
mongoose.connect(mongoUrl)
mongoose.Promise = Promise;


// const Trip = mongoose.model("Trip", {
//   tripID: Number,
//   userID: Number,
//   title: String,
//   isSubmitted: Boolean
// })

// Trip.deleteMany().then(() => { 
//   new Trip({ tripID: 101, userID:1, title:"Admin Conference", isSubmitted: true}).save()
//   new Trip({ tripID: 102, userID:2, title:"Web Summit", isSubmitted: true}).save()
//   new Trip({ tripID: 103, userID:2, title:"Tech Expo", isSubmitted: true}).save()
//   new Trip({ tripID: 104, userID:2, title:"Business Meeting", isSubmitted: false}).save()
// })

// app.get("/", (req, res) => {
//   Trip.find().then(trips => { 
//     res.json(trips)
//    }  
//  )
// });


const Animal = mongoose.model("Animal", {
  name: String,
  age: Number,
  isFurry: Boolean
})

Animal.deleteMany().then(() => {
  new Animal({ name: "Alfons", age: 2, isFurry: true }).save()
  new Animal({ name: "Lucy", age: 3, isFurry: true }).save()
  new Animal({ name: "Goldy", age: 1, isFurry: false }).save()
})

// Start defining your routes here
app.get("/", (req, res) => {
  Animal.find().then(animals => { 
    res.json(animals)
   }  
 )
});

app.get("/:name", (req, res) => {
  Animal.findOne({ name: req.params.name }).then(animal => {
    if (animal) {
      res.json(animal)
    } else {
      res.status(404).json({error: "Not found!"})
    }
  })
}) 


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
