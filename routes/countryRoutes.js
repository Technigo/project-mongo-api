import express from "express";
import { CountryModel } from "../models/Country";

const router = express.Router(); 

//--- *Countries Collection* ---
// Retrieving all Netflix listed countries
router.get("/countries", async(req,res)=>{
    await CountryModel.find()
    .then((result)=>res.json(result))
    .catch((error)=>res.status(500).json(`Retrieval of countries collection failed due to ${error}`));
  })

// Export the router for use in the main application
export default router;