import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import zoo from "./data/zoo.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());


const { Schema } = mongoose;
const userSchema = new Schema ({
  name:String,
  email: String,
});
const User = mongoose.model("User", userSchema);

const zooSchema = new Schema ({
  "animal_name": String,
  "hair": Number,
  "feathers": Number,
  "eggs": Number,
  "milk": Number,
  "airborne": Number,
  "aquatic": Number,
  "predator": Number,
  "toothed": Number,
  "backbone": Number,
  "breathes": Number,
  "venomous": Number,
  "fins": Number,
  "legs": Number,
  "tail": Number,
  "domestic": Number,
  "catsize": Number,
  "class_type": Number
});

const ZooAnimal = mongoose.model("ZooAnimal", zooSchema);

if(process.env.RESET_DATABASE){
  console.log('resetting database')
  const resetDatabase = async () => {
    await ZooAnimal.deleteMany();
    zoo.forEach((zooAnimal) => {
      const newZooAnimal = new ZooAnimal(zooAnimal) 
      newZooAnimal.save()
    }) 
  }
  resetDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Zoo Page!");
});

app.get("/Zoo/:id", async (req, res) => {
// const { legs, class_type } = req.query
  const response = {
  sucess:true,
  body:{}
}

  try{
    const zooAnimal = await ZooAnimal.findbyId(req.params.id);
    if (zooAnimal) {
      res.status(200).json({
        sucess:true,
        body: zooAnimal
      })
    } else {
      res.status(404).json ({
        sucess:false,
        body:{
          message: "Animal not found"
        }
      });
    }
  } catch (error){
    console.error(error);
    res.status(500).json({
      sucess:false,
      body:{
        message: "Internal Server Error",
      },
    });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
