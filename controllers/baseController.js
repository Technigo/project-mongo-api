import AppError from '../utils/appError'
import APIFeatures from '../utils/apiFeatures'
// import { queried } from '../utils/filters';
// import { paginate } from '../utils/pagination';
import { validateQueries } from '../utils/restrictions';

export const getAll = (Model) => async (req, res, next) => {
  try {
    if (!validateQueries(req.query)) {
      return next(new AppError(403, 'Forbidden', 'The queries you provided are not allowed on this endpoint. Please provdie another query'))
    }
    // find data with api features (filter, sort, group)
    const data = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .group();
    
    const doc = await data.mongoQuery;
    
    // send error if we did not find data
    if (!doc) {
      return next(new AppError(400, 'Error', 'The query you provided did not return any data. Please try again'))
    }
        
    // send data back
    res.send({
      numOfGroups: doc.numOfGroups,
      total: doc.length,
      limit: doc.length || 0,
      page: req.query.start || 1,
      items: doc
    });
  } catch (error) {
    next(error)
  }
}