import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { errorHandler } from "./middlewear/errorMiddlewear";

const port = process.env.PORT || 8080;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/restaurants", require("./routes/restaurantRoutes").default);

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
