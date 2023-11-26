import express from "express";
import { TitleModel } from "../models/Title";
import listEndpoints from "express-list-endpoints";
import netflixData from "../data/netflix-titles.json";

const router = express.Router();

// Route to get available endpoints
router.get("/", (req, res) => {
  const endpoints = listEndpoints(router);
  res.json({ endpoints });
});

// Route to get all titles from the database
router.get("/titles", async (req, res) => {
  await TitleModel.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.json(err));
});

// Route to get a specific title by ID from the database
router.get("/titles/:id", async (req, res) => {
  const id = req.params.id;
  await TitleModel.findByIdAndUpdate({ _id: id })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

// Route to get a list of unique categories
router.get("/categories/", (req, res) => {
  let categoryList = [];
  const categories = netflixData.map((title) =>
    title.listed_in
      .split(",")
      .map((category) => category.trim().replace(/ /g, "-").toLowerCase())
  );

  for (let box of categories) {
    for (let cate of box) {
      if (!categoryList.includes(cate)) {
        categoryList.push(cate);
      }
    }
  }
  res.json(categoryList);
});

// Route to get titles by a specific category
router.get("/categories/:titleCategory", (req, res) => {
  const titleCategory = req.params.titleCategory.toLowerCase();
  const catCheck = netflixData.filter((cat) => {
    return cat.listed_in
      .toLowerCase()
      .replace(/ /g, "-")
      .includes(titleCategory);
  });

  catCheck.length > 0
    ? res.json(catCheck)
    : res.status(404).send("Sorry, we have nothing in this category.");
});

// Route to add a new title to the database
router.post("/add", async (req, res) => {
  const show_id = req.body.show_id;
  // ... (repeat for other properties)

  await TitleModel.create({
    show_id: show_id,
    // ... (repeat for other properties)
  })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

// Route to update a title in the database
router.put("/update/:id", async (req, res) => {
  const id = Number(req.params.id);
  const updateData = req.body;

  await TitleModel.findByIdAndUpdate(
    { _id: id },
    { $set: updateData },
    { new: true }
  )
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

// Route to delete a title from the database by ID
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  await TitleModel.findByIdAndDelete({ _id: id })
    .then((result) => {
      if (result) {
        res.json({
          message: "Title deleted successfully",
          deletedTitle: result,
        });
      } else {
        res.status(404).json({ message: "Title not found" });
      }
    })
    .catch((err) => res.json(err));
});

export default router;

// router.delete("/deleteAll", async (req, res) => {
//   await TitleModel.deleteMany({})
//     .then((result) =>
//       res.json({
//         message: "All tasks deleted",
//       })
//     )
//     .catch((err) => res.json(err));
// });
