import express from "express";
import listEndpoints from "express-list-endpoints";
import { ModelNetflix } from "../models/ModelNetflix";

const router = express.Router();

//Defining routes

router.get("/", (req, res) => {
  const endpoints = listEndpoints(router);
  res.json(endpoints);
});

// GET all titles from DB
router.get("/titles", async (req, res) => {
  try {
    const result = await ModelNetflix.find();
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

//Define a route for handling POST requests to retrieva all tasks
// router.post("/add", async () => {
//   const title = req.body.title;
//   await ModelNetflix.create({ title: title })
//     .then((result) => res.json(result))
//     .catch((error) => res.json(error));
// });

router.get("/title/:id", async (req, res) => {
  try {
    const title = await ModelNetflix.findOne({ titleID: req.params.id });
    if (!title) {
      return res.status(404).json({ error: "Title cannot be found" });
    }
    res.json(title);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { router as RoutesNetflix };
