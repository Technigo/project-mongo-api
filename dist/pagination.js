"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function getPaginationParameters(req) {
  var page = Number(req.query.page) || 1;
  var limit = Number(req.query.limit) || 10;
  var skip = (page - 1) * limit;
  return {
    skip: skip,
    limit: limit
  };
}
var _default = exports["default"] = getPaginationParameters;