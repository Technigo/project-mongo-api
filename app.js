import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { worldRoutes } from "./routes/world.routes.js";
import { characterRoutes } from "./routes/character.routes.js";
import { questRoutes } from "./routes/quest.routes.js";
import { itemRoutes } from "./routes/item.routes.js";
import { checkDbConnection } from "./middleware/dbConnection.js";

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(checkDbConnection);

// Routes
app.use("/worlds", worldRoutes);
app.use("/characters", characterRoutes);
app.use("/quests", questRoutes);
app.use("/items", itemRoutes);

// API documentation
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});
