const express = require("express");

const filmsController = require("../controllers/filmsControllers");

const router = express.Router();

router.route("/api/v1/films").get(filmsController.getAllFilms);

module.exports = router;
