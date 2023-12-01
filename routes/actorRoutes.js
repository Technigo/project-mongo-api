import express from "express";
import { ActorModel } from "../models/Actor";

const router = express.Router();

//--- *Actors Collection* ---
// Retrieving all Netflix listed actors
router.get("/actors", async(req,res)=>{
    await ActorModel.find()
    .then((result)=>res.json(result))
    .catch((error)=>res.status(500).json(`Retrieval of actors collection failed due to ${error}`));
  })
  
// Export the router for use in the main application
export default router;