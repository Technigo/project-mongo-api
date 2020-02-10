// app.get('/characters', async (req, res) => {
//   const idAbove = req.query.id
//   const queryString = req.query.name;
//   const queryRegex = new RegExp(queryString, "i");

//   const characters = idAbove
//     ? await Character.find({ id: { $gte: idAbove } })
//     : await Character.find()

//   if (characters.length) {
//     res.json(characters)
//   } else {
//     res.status(404).json({ error: 'No characters found' })
//   }
// })

// //GET ALL CHARACTERS
// app.get('/characters', (req, res) => {
//   const queryString = req.query.name;
//   //Regular expression to make it case insensitive
//   const queryRegex = new RegExp(queryString, "i");
//   Character.find({ 'name': queryRegex })
//     .then((results) => {
//       // Succesfull
//       console.log('Found : ' + results);
//       res.json(results);
//     }).catch((err) => {
//       // Error/Failure
//       console.log('Error ' + err);
//       res.json({ message: 'Cannot find this character', err: err });
//     });
// });


// app.get("/characters", async (req, res) => {
//   let queryObj = {}

//   let startIndex, perPage
//   if (req.query.perPage) {
//     perPage = +req.query.perPage
//   }
//   if (req.query.page && req.query.perPage) {
//     startIndex = perPage * (+req.query.page - 1)
//   }
//   if (req.query.gender) { queryObj['gender'] = new RegExp(req.query.gender, 'i') }
//   if (req.query.id) { queryObj['id'] = req.query.id }
//   if (req.query.job) { queryObj['job'] = new RegExp(req.query.job, 'i') }

//   Character.find(queryObj).sort('job')
//     .then((results) => {
//       let resultsObj = {
//         "total_characters": results.length
//       }
//       // Successful
//       if (req.query.page && req.query.perPage) {
//         resultsObj.characters = results.slice(startIndex, startIndex + perPage)
//         res.json(resultsObj)
//       } else {

//         resultsObj.characters = results
//         res.json(resultsObj)
//       }

//     }).catch((err) => {
//       //Error - Failure
//       res.json({ message: 'Cannot find this character', err: err })
//     })
// })



// //GET SPECIFIC CHARACTER findById http://localhost:9090/characters/5e4059bf9aea56265a66d7e9
// // app.get("/characters/:id", async (req, res) => {
// //   const character = await Character.findById(req.params.id)
// //   if (character) {
// //     res.json(character)
// //   } else {
// //     res.status(404).json({ error: "Character not found" })
// //   }
// // })