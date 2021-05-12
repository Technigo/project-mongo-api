import Sighting from '../models/sightingModel';
import AppError from '../utils/appError';
import APIRequest from '../utils/apiRequest';
import { validateQueries } from '../utils/restrictions';

export const getList = (type) => async (req, res, next) => {
  try {
    if (!validateQueries(req.query, 'lists')) {
      return next(
        new AppError(
          403,
          'Forbidden',
          'The queries you provided are not allowed on this endpoint. Please provdie another query'
        )
      );
    }
    // find data with api features (filter, sort, group)
    const request = new APIRequest(Sighting.find(), req.query).filter().sort().paginate();

    const doc = await request.mongoQuery;

    // send error if we did not find data
    if (!doc) {
      return next(
        new AppError(
          400,
          'Error',
          'The query you provided did not return any data. Please try again'
        )
      );
    }

    // send data back
    res.send({
      limit: doc.length || 0,
      page: +req.query.start || 1,
      items: doc
    });
  } catch (error) {
    next(error);
  }
};