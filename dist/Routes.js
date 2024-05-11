"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _Book = _interopRequireDefault(require("../models/Book.js"));
var _expressListEndpoints = _interopRequireDefault(require("express-list-endpoints"));
var _pagination = _interopRequireDefault(require("../utils/pagination.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var router = _express["default"].Router();

//filter with query parameters
router.get("/filterbooks", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res, next) {
    var _req$query, title, authors, average_rating, num_pages, ratings_count, text_reviews_count, language_code, query, _getPaginationParamet, skip, limit, books, err;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$query = req.query, title = _req$query.title, authors = _req$query.authors, average_rating = _req$query.average_rating, num_pages = _req$query.num_pages, ratings_count = _req$query.ratings_count, text_reviews_count = _req$query.text_reviews_count, language_code = _req$query.language_code;
          query = {};
          _getPaginationParamet = (0, _pagination["default"])(req), skip = _getPaginationParamet.skip, limit = _getPaginationParamet.limit;
          if (title) {
            //find the title with the query parameter
            query.title = {
              $regex: new RegExp(title, "i")
            };
          }
          if (authors) {
            query.authors = {
              $regex: new RegExp(authors, "i")
            };
          }
          if (average_rating) {
            query.average_rating = {
              $gte: Number(average_rating),
              $lt: Number(average_rating) + 1
            };
          }
          if (num_pages) {
            query.num_pages = {
              $gte: Number(num_pages),
              $lt: Number(num_pages) + 100
            };
          }
          if (ratings_count) {
            query.ratings_count = {
              $gte: Number(ratings_count),
              $lt: Number(ratings_count) + 100
            };
          }
          if (text_reviews_count) {
            query.text_reviews_count = {
              $gte: Number(text_reviews_count),
              $lt: Number(text_reviews_count) + 100
            };
          }
          if (language_code) {
            query.language_code = language_code;
          }
          _context.next = 13;
          return _Book["default"].find(query).skip(skip).limit(limit).exec();
        case 13:
          books = _context.sent;
          // Limit the number of results to 100
          res.json(books);
          _context.next = 21;
          break;
        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error fetching filtered books : ".concat(_context.t0)); // Pass the error to the next middleware
          next(err);
        case 21:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 17]]);
  }));
  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
router.get("/books/", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res, next) {
    var _getPaginationParamet2, skip, limit, title, queryRegex, books, err;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _getPaginationParamet2 = (0, _pagination["default"])(req), skip = _getPaginationParamet2.skip, limit = _getPaginationParamet2.limit;
          title = req.query.title;
          queryRegex = {
            $regex: new RegExp(title, "i")
          };
          _context2.next = 6;
          return _Book["default"].find({
            title: queryRegex
          }).sort({
            title: 1
          }).skip(skip).limit(limit);
        case 6:
          books = _context2.sent;
          res.json(books);
          _context2.next = 14;
          break;
        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error fetching books: ".concat(_context2.t0)); // Pass the error to the next middleware
          next(err);
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 10]]);
  }));
  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
router.get("/books/:id", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res, next) {
    var id, book, err;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _context3.next = 4;
          return _Book["default"].findById(id).exec();
        case 4:
          book = _context3.sent;
          if (book) {
            res.json(book);
          } else {
            res.status(404).json({
              error: "ID:".concat(id, " Not found")
            });
          }
          _context3.next = 12;
          break;
        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error fetching books with this id : ".concat(_context3.t0)); // Pass the error to the next middleware
          next(err);
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}());
router.get("/books/authors/:authors", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res, next) {
    var _getPaginationParamet3, skip, limit, authors, queryRegex, book, err;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _getPaginationParamet3 = (0, _pagination["default"])(req), skip = _getPaginationParamet3.skip, limit = _getPaginationParamet3.limit;
          authors = req.params.authors;
          queryRegex = new RegExp(authors, "i"); // Create a case-insensitive regex to match authors
          _context4.next = 6;
          return _Book["default"].find({
            authors: {
              $regex: queryRegex
            }
          }).skip(skip).limit(limit);
        case 6:
          book = _context4.sent;
          if (book.length > 0) {
            res.json(book);
          } else {
            res.status(404).json({
              error: "Author: ".concat(authors, " not found")
            });
          }
          _context4.next = 14;
          break;
        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error fetching books with authors: ".concat(_context4.t0)); // Pass the error to the next middleware
          next(err);
        case 14:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 10]]);
  }));
  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}());
router.get("/books/average_rating/:average_rating", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res, next) {
    var _getPaginationParamet4, skip, limit, average_rating, book, err;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _getPaginationParamet4 = (0, _pagination["default"])(req), skip = _getPaginationParamet4.skip, limit = _getPaginationParamet4.limit;
          average_rating = Number(req.params.average_rating);
          _context5.next = 5;
          return _Book["default"].find({
            average_rating: {
              $gte: average_rating,
              $lt: average_rating + 1
            }
          }).skip(skip).limit(limit);
        case 5:
          book = _context5.sent;
          if (book.length > 0) {
            res.json(book);
          } else {
            res.status(404).json({
              error: "No results for this rating: ".concat(average_rating)
            });
          }
          _context5.next = 13;
          break;
        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error fetching books with rating: ".concat(_context5.t0)); // Pass the error to the next middleware
          next(err);
        case 13:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 9]]);
  }));
  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());
router.get("/books/pages_asc/:num_pages", /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res, next) {
    var _getPaginationParamet5, skip, limit, num_pages, book, err;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _getPaginationParamet5 = (0, _pagination["default"])(req), skip = _getPaginationParamet5.skip, limit = _getPaginationParamet5.limit;
          num_pages = Number(req.params.num_pages);
          _context6.next = 5;
          return _Book["default"].find({
            num_pages: {
              $gte: num_pages,
              $lt: num_pages + 50
            }
          }).sort({
            num_pages: 1
          }).skip(skip).limit(limit);
        case 5:
          book = _context6.sent;
          if (book.length > 0) {
            res.json(book);
          } else {
            res.status(404).json({
              error: "Book with ".concat(num_pages, " pages not found")
            });
          }
          _context6.next = 13;
          break;
        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error fetching books with set amount of pages: ".concat(_context6.t0)); // Pass the error to the next middleware
          next(err);
        case 13:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 9]]);
  }));
  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}());
router.get("/books/pages_desc/:num_pages", /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res, next) {
    var _getPaginationParamet6, skip, limit, num_pages, book, err;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _getPaginationParamet6 = (0, _pagination["default"])(req), skip = _getPaginationParamet6.skip, limit = _getPaginationParamet6.limit;
          num_pages = Number(req.params.num_pages);
          _context7.next = 5;
          return _Book["default"].find({
            num_pages: {
              $gte: num_pages,
              $lt: num_pages + 50
            }
          }).sort({
            num_pages: -1
          }).skip(skip).limit(limit);
        case 5:
          book = _context7.sent;
          if (book.length > 0) {
            res.json(book);
          } else {
            res.status(404).json({
              error: "Book with ".concat(num_pages, " pages not found")
            });
          }
          _context7.next = 13;
          break;
        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error fetching books with set amount of pages: ".concat(_context7.t0)); // Pass the error to the next middleware
          next(err);
        case 13:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 9]]);
  }));
  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}());
router.get("/books/ratings_count/:ratings_count", /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res, next) {
    var _getPaginationParamet7, skip, limit, ratings_count, book, err;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _getPaginationParamet7 = (0, _pagination["default"])(req), skip = _getPaginationParamet7.skip, limit = _getPaginationParamet7.limit;
          ratings_count = Number(req.params.ratings_count);
          _context8.next = 5;
          return _Book["default"].find({
            ratings_count: {
              $gte: ratings_count,
              $lt: ratings_count + 50
            }
          }).skip(skip).limit(limit);
        case 5:
          book = _context8.sent;
          if (book.length > 0) {
            res.json(book);
          } else {
            res.status(404).json({
              error: "Rating count ".concat(ratings_count, " not found")
            });
          }
          _context8.next = 13;
          break;
        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error fetching rating  : ".concat(_context8.t0)); // Pass the error to the next middleware
          next(err);
        case 13:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 9]]);
  }));
  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}());
router.get("/books/text_reviews_count/:text_reviews_count", /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res, next) {
    var _getPaginationParamet8, skip, limit, text_reviews_count, book, err;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _getPaginationParamet8 = (0, _pagination["default"])(req), skip = _getPaginationParamet8.skip, limit = _getPaginationParamet8.limit;
          text_reviews_count = Number(req.params.text_reviews_count);
          _context9.next = 5;
          return _Book["default"].find({
            text_reviews_count: {
              $gte: text_reviews_count,
              $lt: text_reviews_count + 50
            }
          }).skip(skip).limit(limit);
        case 5:
          book = _context9.sent;
          if (book.length > 0) {
            res.json(book);
          } else {
            res.status(404).json({
              error: "Books with ".concat(text_reviews_count, " text reviews not found")
            });
          }
          _context9.next = 13;
          break;
        case 9:
          _context9.prev = 9;
          _context9.t0 = _context9["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error fetching books with text reviews: ".concat(_context9.t0)); // Pass the error to the next middleware
          next(err);
        case 13:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 9]]);
  }));
  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}());
router.get("/books/language_code/:language_code", /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res, next) {
    var language_code, _getPaginationParamet9, skip, limit, book, err;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          language_code = req.params.language_code;
          _context10.prev = 1;
          _getPaginationParamet9 = (0, _pagination["default"])(req), skip = _getPaginationParamet9.skip, limit = _getPaginationParamet9.limit;
          _context10.next = 5;
          return _Book["default"].find({
            language_code: language_code
          }).skip(skip).limit(limit);
        case 5:
          book = _context10.sent;
          if (book.length > 0) {
            res.json(book);
          } else {
            res.status(404).json({
              error: "".concat(language_code, " Language code not found")
            });
          }
          _context10.next = 13;
          break;
        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](1);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error fetching book with language code : ".concat(_context10.t0)); // Pass the error to the next middleware
          next(err);
        case 13:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[1, 9]]);
  }));
  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}());

//add new book
router.post("/books/add/", /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res, next) {
    var newBook, err;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return new _Book["default"](req.body).save();
        case 3:
          newBook = _context11.sent;
          res.status(201).json(newBook);
          _context11.next = 11;
          break;
        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error adding new book: ".concat(_context11.t0)); // Pass the error to the next middleware
          next(err);
        case 11:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 7]]);
  }));
  return function (_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}());

//update book
router.put("/books/update/:id", /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(req, res, next) {
    var book, fieldsToUpdate, updatedBook, err;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return _Book["default"].findById(req.params.id);
        case 3:
          book = _context12.sent;
          if (!book) {
            _context12.next = 13;
            break;
          }
          // Update the fields
          fieldsToUpdate = ["title", "authors", "average_rating", "isbn", "isbn13", "language_code", "num_pages", "ratings_count", "text_reviews_count"];
          fieldsToUpdate.forEach(function (field) {
            book[field] = req.body[field] || book[field];
          });
          // Save the updated book
          _context12.next = 9;
          return book.save();
        case 9:
          updatedBook = _context12.sent;
          res.json(updatedBook);
          _context12.next = 14;
          break;
        case 13:
          res.status(404).json({
            error: "Book not found"
          });
        case 14:
          _context12.next = 20;
          break;
        case 16:
          _context12.prev = 16;
          _context12.t0 = _context12["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error updating book: ".concat(_context12.t0)); // Pass the error to the next middleware
          next(err);
        case 20:
        case "end":
          return _context12.stop();
      }
    }, _callee12, null, [[0, 16]]);
  }));
  return function (_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}());

//delete book
router["delete"]("/books/delete/:id", /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(req, res, next) {
    var book, err;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return _Book["default"].findByIdAndDelete(req.params.id);
        case 3:
          book = _context13.sent;
          if (book) {
            res.json({
              message: "Book deleted"
            });
          } else {
            res.status(404).json({
              error: "Book not found"
            });
          }
          _context13.next = 11;
          break;
        case 7:
          _context13.prev = 7;
          _context13.t0 = _context13["catch"](0);
          // If an error occurred, create a new error with a custom message
          err = new Error("Error deleting book: ".concat(_context13.t0)); // Pass the error to the next middleware
          next(err);
        case 11:
        case "end":
          return _context13.stop();
      }
    }, _callee13, null, [[0, 7]]);
  }));
  return function (_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
  };
}());

// get updated documentation
router.get("/", function (req, res, next) {
  try {
    var endpoints = (0, _expressListEndpoints["default"])(router);
    var updatedEndpoints = endpoints.map(function (endpoint) {
      if (endpoint.path === "/filterbooks") {
        return {
          path: endpoint.path,
          methods: endpoint.methods,
          queryParameters: [{
            name: "title",
            description: "Filter by title. Example: /filterbooks?title=Neither Here nor There: Travels in Europe. Can be chained with other parameters. Example: /filterbooks?title=Neither Here nor There: Travels in Europe&language_code=eng"
          }, {
            name: "authors",
            description: "Filter by authors. Example:/filterbooks?authors=bill Can be chained with other parameters.  Example:/filterbooks?authors=bill&average_rating=3 "
          }, {
            name: "average_rating",
            description: "Filter by average rating. Example: /filterbooks?average_rating=3 Can be chained with other parameters Example: /filterbooks?average_rating=3&num_pages=200"
          }, {
            name: "num_pages",
            description: "Filter by number of pages. Example: /filterbooks?num_pages=200 Can be chained with other parameters. Example: /filterbooks?num_pages=200&ratings_count=1000&text_reviews_count=200"
          }, {
            name: "ratings_count",
            description: "Filter by ratings count. Example: /filterbooks?ratings_count=1000 Can be chained with other parameters  Example: /filterbooks?ratings_count=1000&text_reviews_count=200"
          }, {
            name: "text_reviews_count",
            description: "Filter by text reviews count. Example: /filterbooks?text_reviews_count=200 Can be chained with other parameters Example: /filterbooks?text_reviews_count=200&language_code=eng&average_rating=4"
          }, {
            name: "language_code",
            description: "Filter by language code. Example: /filterbooks?language_code=eng Can be chained with other parameters Example: /filterbooks?language_code=eng&average_rating=4"
          }, {
            name: "page",
            description: "The page number to retrieve. Defaults to 1 if not provided. Example: /?page=2 can be chained with limit. Example: /?page=2&limit=5 Can also be chained with other queries if using /filterbooks/ Example: filterbooks?page=2&limit=5&text_reviews_count=200&language_code=eng&average_rating=4"
          }, {
            name: "limit",
            description: "The number of items per page. Defaults to 10 if not provided. Example: /?limit=5  can be chained with page but also other queries if using /filterbooks/ Example: filterbooks?page=2&limit=5&text_reviews_count=200&language_code=eng&average_rating=4"
          }]
        };
      }
      return {
        path: endpoint.path,
        methods: endpoint.methods
      };
    });
    res.json(updatedEndpoints);
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    var err = new Error("Error updating endpoints: ".concat(error));
    // Pass the error to the next middleware
    next(err);
  }
});
var _default = exports["default"] = router;