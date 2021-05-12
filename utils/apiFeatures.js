// import moment from 'moment';
// import _ from 'lodash';
// import { parseDate } from './dates';
// import AppError from './appError';

export default class APIFeatures {
  constructor(mongoQuery, requestQuery) {
    this.mongoQuery = mongoQuery;
    this.requestQuery = requestQuery;
  }

  filter() {
    if ('yearRange' in this.requestQuery) {
      const range = this.requestQuery.yearRange.split('-');
      // filter by range of 2 year values
      this.mongoQuery = this.mongoQuery.where('date').gte(range[0]).lte(range[1]);
    }
    // filter by countries
    if ('countries' in this.requestQuery) {
      const countries = this.requestQuery.countries.split(',');
      this.mongoQuery = this.mongoQuery.in('country', countries);
    }

    // filter by shape
    if ('shapes' in this.requestQuery) {
      const shapes = this.requestQuery.shapes.split(',');
      this.mongoQuery = this.mongoQuery.in('shape', shapes);
    }
    return this;
  }

  sort() {
    return this;
  }

  group() {
    return this;
  }

  paginate() {
    return this;
  }
}
