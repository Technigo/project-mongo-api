import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { errorHandler } from "./middlewear/errorMiddlewear";

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./openapi.json");

const port = process.env.PORT || 8080;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/restaurants", require("./routes/restaurantRoutes").default);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //openapi documentation with swagger

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
