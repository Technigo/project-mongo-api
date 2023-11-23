import express from "express";
import listEndpoints from "express-list-endpoints";
import { MetallicaSongModel } from "../models/MetallicaSongModel";

const router = express.Router()

// ------- Routes -------
// Show all endpoints in a json format
router.get("/", (req, res) => {
   const endpoints = listEndpoints(router)
   res.json(endpoints);
});

// Show all Metallica songs
router.get("/songs", async (req, res) => {
    await MetallicaSongModel.find()
    .then((result) => res.json(result))
    .catch((error) => res.json(error))
})

// router.get("/metallica-songs", async (req, res) => {
//   try {
//   const metallicaSongs = await MetallicaSongModel.find({})
//   res.json(metallicaSongs)
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// Export the router for use in the main application
//export default router
module.exports = router;