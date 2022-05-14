import express from "express";

import years from "../controllers/years";

const router = express.Router();

router.get("/", years.allYears);
router.get("/:year", years.astronautByYear);

module.exports = router;