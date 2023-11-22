import express from "express";
import { MetallicaSongModel } from "../models/MetallicaSongModel";

const router = express.Router()

router.get("/songs", async (req, res) => {
    await MetallicaSongModel.find()
    .then((result) => res.json(result))
    .catch((error) => res.json(error))
})