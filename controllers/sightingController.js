import _ from 'lodash';

import Sighting from '../models/sightingModel';
import AppError from '../utils/appError';
import APIRequest from '../utils/apiRequest';
import { validateQueries } from '../utils/restrictions';

export const getAll = async (req, res, next) => {
  try {
    if (!validateQueries(req.query)) {
      return next(
        new AppError(
          403,
          'Forbidden',
          'The queries you provided are not allowed on this endpoint. Please provdie another query'
        )
      );
    }
    
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

export const getOne = async (req, res, next) => {
  try {
    if (_.keys(req.query).length > 0) {
      return next(
        new AppError(403, 'Forbidden', 'Queries are not allowed for this endpoint')
      );
    }
    const { id } = req.params;
    // find data with api features (filter, sort, group)
    const doc = await Sighting.findById(id);

    // send error if we did not find data
    if (!doc) {
      return next(
        new AppError(
          404,
          'Not Found',
          'The ID you provided did not exist. Please try again'
        )
      );
    }

    // send data back
    res.send({
      item: doc
    });
  } catch (error) {
    next(error);
  }
};
