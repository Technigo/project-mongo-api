"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _winston = _interopRequireDefault(require("winston"));
var _winstonDailyRotateFile = _interopRequireDefault(require("winston-daily-rotate-file"));
var _morgan = _interopRequireDefault(require("morgan"));
var _Routes = _interopRequireDefault(require("./routes/Routes.js"));
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireWildcard(require("path"));
var _url = require("url");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
_mongoose["default"].connect(mongoUrl);
_mongoose["default"].Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
var port = process.env.PORT || 7777;
var app = (0, _express["default"])();
app.use("/", _Routes["default"]);

// Add middlewares to enable cors and json body parsing
app.use((0, _cors["default"])());
app.use(_express["default"].json());

// Define __filename and __dirname
var _filename = (0, _url.fileURLToPath)(import.meta.url);
var _dirname = (0, _path.dirname)(_filename);
// Define logs directory
var logs = _path["default"].join(_dirname, "logs");
// Create a write stream (in append mode)
var accessLogStream = _fs["default"].createWriteStream(_path["default"].join(logs, "access.log"), {
  flags: "a"
});

// Set up winston with DailyRotateFile transport to avoid log file size growing indefinitely
var logger = _winston["default"].createLogger({
  level: "info",
  format: _winston["default"].format.json(),
  defaultMeta: {
    service: "book-api-service"
  },
  transports: [
  // Rotate log files daily
  new _winstonDailyRotateFile["default"]({
    filename: _path["default"].join(logs, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error"
  }), new _winstonDailyRotateFile["default"]({
    filename: _path["default"].join(logs, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d"
  }),
  // Log to the console
  new _winston["default"].transports.Console({
    format: _winston["default"].format.simple()
  })]
});

// Create a write stream for morgan and write Morgan logs to winston
var morganStream = {
  write: function write(message) {
    logger.info(message);
  }
};

// Log remote address, remote user, date, HTTP method, URL, HTTP version, status code, content length, referrer, and user-agent.
app.use((0, _morgan["default"])("combined", {
  stream: morganStream
}));

// Error handling middleware
_Routes["default"].use(function (err, req, res, next) {
  console.error(err.stack); // Log error stack trace
  res.status(500).send({
    error: err.message
  }); // Send error message to client
});

// Handle uncaught exceptions
process.on("uncaughtException", function (err) {
  logger.error(err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", function (reason, promise) {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start the server
app.listen(port, function () {
  console.log("Server running on http://localhost:".concat(port));
});