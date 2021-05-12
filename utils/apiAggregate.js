export default class APIAggregate {
  constructor(aggregation, list) {
    this.aggregation = aggregation;
    this.list = list;
  }

  getList() {
    switch (this.list) {
      case 'preInternet':
        return this.preInternet();
      case 'postInternet':
        return this.postInternet();
      case 'shapes':
        return this.shapes();
      default:
        return this;
    }
  }
  
  sort() {
    // default sort date ascending order
    this.aggregation = this.aggregation.sort('-date');
    return this;
  }

  // LISTS
  preInternet() {
    this.aggregation.match({
      date: { $lte: new Date(1983) }
    });
    return this;
  }

  postInternet() {
    this.aggregation.match({
      date: { $gte: new Date(1983) }
    });
    return this;
  }

  shapes() {
    this.aggregation.group({
      _id: '$shape'
    });
    return this;
  }
}
