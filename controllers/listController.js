import _ from 'lodash';

import Sighting from '../models/sightingModel';
import AppError from '../utils/appError';
import APIAggregate from '../utils/apiAggregate';

export const getList = (type) => async (req, res, next) => {
  try {
    if (_.keys(req.query).length > 0) {
      return next(
        new AppError(403, 'Forbidden', 'Queries are not allowed for this endpoint')
      );
    }
    const request = new APIAggregate(Sighting.aggregate(), type).getList().sort();

    const doc = await request.aggregation;

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