export default class APIRequest {
  constructor(mongoQuery, requestQuery) {
    this.mongoQuery = mongoQuery;
    this.requestQuery = requestQuery;
  }

  filter() {
    // filter by range of 2 year values
    if ('yearRange' in this.requestQuery) {
      const range = this.requestQuery.yearRange.split('-');
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
    // default sort date ascending order
    const sortBy = this.requestQuery.sortBy || 'date';
    const orderBy = this.requestQuery.orderBy || 'asc';
    this.mongoQuery = this.mongoQuery.sort({ [sortBy]: orderBy });
    return this;
  }

  paginate() {
    const limit = +this.requestQuery.limit || 25;
    const start = +this.requestQuery.start || 1;
    const page = (start - 1) * limit;

    this.mongoQuery = this.mongoQuery.skip(page).limit(limit);
    return this;
  }
}
