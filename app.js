import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

import { userRoutes } from "./routes/userRoutes.js";
import { tripRoutes } from "./routes/tripRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);

// API documentation
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.send({
    message: "This API returns info of users and trips",
    endpoints: endpoints,
  });
});

// Error Handling Middleware
app.use(errorHandler);