import Show from '../models/show';
import { stringSearch } from '../helpers/stringSearch';

const getShowById = async (req, res) => {
  const { id } = req.params;
  const show = await Show.find({ show_id: +id });

  if (show.length > 0) {
    res.json({
      statusCode: 200,
      message: 'Movie fetched successfully',
      data: show
    });
  } else {
    res.status(404).json({
      statusCode: 404,
      error: `No movie found with id ${id}`,
      params: req.params
    });
  }
};

const getAllShows = (req, res) => {
  const {
    page,
    director,
    title,
    actor,
    country,
    year,
    rating,
    duration,
    category,
    description,
    type
  } = req.query;
  const query = {};

  if (title) {
    query.title = stringSearch(title);
  }

  if (director) {
    query.director = stringSearch(director);
  }

  if (actor) {
    query.cast = stringSearch(actor);
  }

  if (country) {
    query.country = stringSearch(country);
  }

  if (year) {
    query.release_year = +year;
  }

  if (rating) {
    query.rating = stringSearch(rating);
  }

  if (duration) {
    query.duration = stringSearch(duration);
  }

  if (category) {
    query.listed_in = stringSearch(category);
  }

  if (description) {
    query.description = stringSearch(description);
  }

  if (type) {
    query.type = stringSearch(type);
  }

  if (page) {
    let ITEMS_PER_PAGE = 20;
    let startIndex = page * ITEMS_PER_PAGE - ITEMS_PER_PAGE; // Page 1 starts at index 0
    let totalPages;
    let remainingPages;

    // Query to get total number of objects for the query to calculate totalPages and remainingPages
    Show.where(query).countDocuments((err, count) => {
      totalPages = Math.ceil(count / ITEMS_PER_PAGE);
      remainingPages = totalPages - page;

      Show.find(query)
        .skip(startIndex)
        .limit(ITEMS_PER_PAGE)
        .then(shows => {
          if (shows.length > 0) {
            const moviePhrase = shows.length > 1 ? `Movies` : `Movie`;

            res.json({
              statusCode: 200,
              message: `${moviePhrase} fetched successfully`,
              totalPages: totalPages,
              remainingPages: remainingPages,
              totalItems: count,
              query: req.query,
              data: shows
            });
          } else {
            res.status(404).send({
              statusCode: 404,
              error: 'No movies found',
              query: req.query
            });
          }
        });
    });
  } else {
    Show.find(query).then(shows => {
      if (shows.length > 0) {
        const moviePhrase = shows.length > 1 ? `Movies` : `Movie`;

        res.json({
          statusCode: 200,
          message: `${moviePhrase} fetched successfully`,
          query: req.query,
          data: shows
        });
      } else {
        res.status(404).send({
          statusCode: 404,
          error: 'No movies found',
          query: req.query
        });
      }
    });
  }
};

const postShow = (req, res) => {
  const newShow = new Show(req.body);
  newShow.save();
  return res.json(newShow);
};

module.exports = {
  getShowById,
  getAllShows,
  postShow
};
