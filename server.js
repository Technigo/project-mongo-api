import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import morgan from "morgan";
import router from "./routes/Routes.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use("/", router);

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Custom error classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 7777;

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Define logs directory
const logs = path.join(__dirname, "logs");
// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(logs, "access.log"), {
  flags: "a",
});

// Set up winston with DailyRotateFile transport to avoid log file size growing indefinitely
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "book-api-service" },
  transports: [
    // Rotate log files daily
    new DailyRotateFile({
      filename: path.join(logs, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
    }),
    new DailyRotateFile({
      filename: path.join(logs, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    // Log to the console
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Create a write stream for morgan and write Morgan logs to winston
const morganStream = {
  write: (message) => {
    logger.info(message);
  },
};

// Log remote address, remote user, date, HTTP method, URL, HTTP version, status code, content length, referrer, and user-agent.
app.use(morgan("combined", { stream: morganStream }));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(err.status).send({ error: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(err.status).send({ error: err.message });
  } else {
    console.error(err.stack); // Log error stack trace
    res.status(500).send({ error: err.message }); // Send error message to client
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(err);
  //process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  //process.exit(1);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
