const Film = require("../models/filmsModel");
const APIFeatures = require("../utils/apiFeatures");

exports.aliasLatestMovies = (req, res, next) => {
  req.query.limit = "10";
  req.query.sort = "release_year";
  next();
};

exports.getAllFilms = async (req, res) => {
  try {
    const features = new APIFeatures(Film.find(), req.query).paginate().sort().filter();

    const films = await features.query;

    res.status(200).json({
      status: 200,
      results: films.length,
      data: { films },
    });
  } catch (err) {
    console.error(err);

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Film.aggregate([
      {
        $unwind: "$type",
      },
      {
        $match: {
          type: "Movie",
        },
      },
      {
        $sort: { release_year: -1 },
      },
      {
        $limit: 20,
      },
    ]);

    res.status(200).json({
      status: 200,
      results: movies.length,
      data: { movies },
    });
  } catch (err) {
    console.error(err);

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

exports.getFilm = async (req, res) => {
  try {
    const film = await Film.aggregate([
      {
        $unwind: "$title",
      },
      {
        $match: {
          title: req.params.title,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: film,
    });
  } catch (err) {
    console.error(err);

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};
