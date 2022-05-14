import express from "express";

import astronauts from "../controllers/astronauts";

const router = express.Router();

router.get("/", astronauts.allAstronauts);
router.get("/:name", astronauts.astronautByName);

module.exports = router;