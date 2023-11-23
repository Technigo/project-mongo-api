const express = require("express");

const filmsController = require("../controllers/filmsControllers");

const router = express.Router();

router.route("/latest-filmes").get(filmsController.aliasLatestMovies, filmsController.getAllFilms);
router.route("/movies").get(filmsController.getMovies);
router.route("/title/:title").get(filmsController.getFilm);
router.route("/").get(filmsController.getAllFilms);
module.exports = router;
