const Film = require("../models/filmsModel");
const APIFeatures = require("../utils/apiFeatures");

exports.aliasLatestMovies = (req, res, next) => {
  //latest movie api giving queries before fetching
  req.query.limit = "10";
  req.query.sort = "release_year";
  next();
};

exports.getAllFilms = async (req, res) => {
  try {
    const features = new APIFeatures(Film.find(), req.query).paginate().sort().filter(); //sort/filter/paginate with query
    const films = await features.query;

    if (!films)
      return res.status(404).json({
        status: "fail",
        message: "Could not find films",
      });

    res.status(200).json({
      status: "success",
      results: films.length,
      data: { films },
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "fail",
      message: "Something went wrong 💥",
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

    if (!movies)
      return res.status(404).json({
        status: "fail",
        message: "No movies available",
      });

    res.status(200).json({
      status: "success",
      results: movies.length,
      data: { movies },
    });
  } catch (err) {
    console.error(err);

    res.status(400).json({
      status: "fail",
      message: "Something went wrong 👀",
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

    if (!film)
      return res.status(404).json({
        status: "fail",
        message: "No film with that ID",
      });

    res.status(200).json({
      status: "success",
      data: film,
    });
  } catch (err) {
    console.error(err);

    res.status(400).json({
      status: "fail",
      message: "Something went wrong 👀",
    });
  }
};
