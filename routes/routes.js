// import express from "express";
// import NetflixShow from "server.js"

// const router = express.Router();

// router.get("/get", async (req, res) => {
//   await NetflixShow.find()
//     .then((result) => {
//       res.json(result);
//     })
//     .catch((err) => res.json(err));
// });

// router.get("/get/:id", async (req, res) => {
//   const id = req.params.id;
//   await NetflixShow.findByIdAndUpdate({ _id: id })
//     .then((result) => res.json(result))
//     .catch((err) => res.json(err));
// });

// router.post("/add", async (req, res) => {
//   const show_id = req.body.show_id;
//   const title = req.body.title;
//   const director = req.body.director;
//   const cast = req.body.cast;
//   const country = req.body.country;
//   const date_added = req.body.date_added;
//   const release_year = req.body.release_year;
//   const rating = req.body.rating;
//   const duration = req.body.duration;
//   const listed_in = req.body.listed_in;
//   const description = req.body.description;
//   const type = req.body.type;

//   await NetflixShow.create({
//     show_id: show_id,
//     title: title,
//     director: director,
//     cast: cast,
//     country: country,
//     date_added: date_added,
//     release_year: release_year,
//     rating: rating,
//     duration: duration,
//     listed_in: listed_in,
//     description: description,
//     type: type,
//   })
//     .then((result) => res.json(result))
//     .catch((err) => res.json(err));
// });

// router.put("/update/:id", async (req, res) => {
//   const id = req.params.id;

//   const updateData = req.body;

//   console.log(id);

//   await NetflixShow.findByIdAndUpdate(
//     { _id: id },
//     { $set: updateData },
//     { new: true }
//   )
//     .then((result) => res.json(result))
//     .catch((err) => res.json(err));
// });

// router.delete("/delete/:id", async (req, res) => {
//   const id = req.params.id;
//   console.log(id);

//   await NetflixShow.findByIdAndDelete({ _id: id })
//     .then((result) => {
//       if (result) {
//         res.json({
//           message: "Title deleted successfully",
//           deletedTitle: result,
//         });
//       } else {
//         res.status(404).json({ message: "Title not found" });
//       }
//     })
//     .catch((err) => res.json(err));
// });

// router.put("/deleteAll", async (req, res) => {
//   await NetflixShow.deleteMany({})
//     .then((result) =>
//       res.json({
//         message: "All tasks deleted",
//       })
//     )
//     .catch((err) => res.json(err));
// });

// export default router;