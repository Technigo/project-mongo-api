import express from "express";

import missions from "../controllers/missions";

const router = express.Router();

router.get("/", missions.allMissions);

module.exports = router;