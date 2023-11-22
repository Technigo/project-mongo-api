const Film = require("../models/filmsModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllFilms = async (req, res) => {
  try {
    const features = new APIFeatures(Film.find(), req.query).paginate();

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
