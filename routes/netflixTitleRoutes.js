import express from "express";
import {NetflixTitleModel, ActorModel, CountryModel} from "../models/NetflixTitle";

// Creating an instance of the Express router
// The router method in this code is like setting up a map or a blueprint for handling different kinds of requests in a web application. It helps organize and define how the application should respond when someone visits different URLs. Think of it as creating a list of instructions for the app to follow when it receives specific requests, like "show me all titles" or "register a new user." This makes the code neat and helps the app know what to do when someone interacts with it.
const router = express.Router();
const listEndpoints = require('express-list-endpoints')

// -------Defining routes for handling GET requests-------

//---- Documentation of API ----
router.get("/", (req, res) => {
    const endpoints = listEndpoints(app);
    res.json(endpoints)
  });

// --- NetflixTitles collection ---

// Retrieving all Netflix titles or one title by searched title string
// https://www.mongodb.com/docs/manual/reference/operator/query/regex/#examples
router.get("/titles", async (req,res)=>{
    // Use the NetflixTitleModel to find all titles in the database
    // Mongoose Method: NetflixTitleModel.find()
    //Description: The find() method is a Mongoose method that retrieves all documents from the specified collection (in this case, the "titles" collection). The found titles are then responded to the client in JSON format.
    const title =req.query.search
    let regex = new RegExp(title, "gi");
    //Retrieving a title by searched title string
    if(title){
        console.log(title);
        await NetflixTitleModel.find({title: {$regex: regex}}).exec()
    .then((result)=>res.json(result))
    .catch((error)=>res.status(404).json(`I dont have any matching title with ${title}`));
    }else{
      //Retrieving all Netflix titles
        await NetflixTitleModel.find()
        .then((result)=>res.json(result))
        .catch((error)=>res.status(500).json(error));
    }    
});

//Retrieving one Netflix title by id (generated by mongoDB)
router.get("/titles/:id", async (req, res)=>{
    await NetflixTitleModel.find(req.params.id)
    .then((result)=>res.json(result))
    .catch((error)=>res.status(404).json(`This id ${req.params.id} was not found.`));  
  })

// Retrieving one Netflix title by show id
// https://mongoosejs.com/docs/api/model.html#Model.find()
router.get("/titles/show/:showid", async (req, res)=>{
    await NetflixTitleModel.find({show_id:req.params.showid}).exec()
    .then((result)=>res.json(result))
    .catch((error)=>res.status(404).json(`This id ${req.params.showid} was not found.`));  
  })

//--- Actors Collection ---
// Retrieving all Netflix listed actors
router.get("/actors", async(req,res)=>{
    await ActorModel.find()
    .then((result)=>res.json(result))
    .catch((error)=>res.status(500).json(`Retrieval of actors collection failed due to ${error}`));
})

//--- Countries Collection ---
// Retrieving all Netflix listed countries
router.get("/countries", async(req,res)=>{
    await CountryModel.find()
    .then((result)=>res.json(result))
    .catch((error)=>res.status(500).json(`Retrieval of countries collection failed due to ${error}`));
})

//--------- Define a route for handling POST requests to add a new title ---------
router.post("/titles", async (req, res) => {
    const netflixTitle = req.body;
    console.log(netflixTitle)
    // Use NetflixTitleModel to create a new title with the provided data
    // Mongoose Method: NetflixTitleModel.create(netflixTitle) =object
    // Description: This route handles HTTP POST requests and is used to add a new title to the database. It extracts the title data from the request body and then uses the create() method, which is a Mongoose method, to create a new title document with the provided data. The newly created title is then responded to the client in JSON format.
    await NetflixTitleModel.create(netflixTitle )
      .then((result) => res.json(result))
      .catch((error) => res.status(500).json({ message: `Posting ${netflixTitle} failed` }));
  });

  //------- Define a route for handling PUT requests to update a specific title by ID ---------
router.put("/update/:id", async (req, res) => {
    // Extract the title ID from the request parameters
    const { id } = req.params;
    console.log(id); // Log the ID to the console
    // Use NetflixTitleModel to find and update a title by its ID, marking it as done
    // Mongoose Method: NetflixTitleModel.findByIdAndUpdate({ show_id: id })
    // Description: This route handles HTTP PUT requests and is responsible for updating a specific title by its ID. It extracts the title ID from the request parameters, and then it uses the findByIdAndUpdate() method, which is a Mongoose method, to find and update a title by its ID. The updated title is then responded to the client in JSON format.
    await NetflixTitleModel.findByIdAndUpdate({ id: show_id })
      .then((result) => res.json(result)) // Respond with the updated title in JSON format
      .catch((error) => res.status(404).json({ message: `Updating ${id} failed with error: ${error}` })); // Handle any errors that occur during the operation
  });

  // ---------- Define a route for handling DELETE requests to delete a specific title by ID -------------
router.delete("/titles/:id", async (req, res) => {
    // Extract the title ID from the request parameters
    const { id } = req.params;
    // Use NetflixTitleModel to find and delete a title by its ID
    // Mongoose Method: NetflixTitleModel.findByIdAndDelete(id)
    // Description: This route handles HTTP DELETE requests and is responsible for deleting a specific task by its ID. It extracts the task ID from the request parameters and then uses the findByIdAndDelete() method, which is a Mongoose method, to find and delete the task by its ID. If the task is found and successfully deleted, it responds with a success message and the deleted task in JSON format. If the task is not found, it responds with a 404 error.
    await NetflixTitleModel.findByIdAndDelete(id)
      .then((result) => {
        if (result) {
          res.json({
            message: `Title: ${result.title} deleted successfully`,
            deletedTitle: result,
          }); // Respond with a success message and the deleted title
        } else {
          res.status(404).json({ message: `Id ${id} not found` }); // Respond with a 404 error if the title is not found
        }
      })
      .catch((error) => res.status(500).json(error)); // Handle any errors that occur during the operation
  });
  
// Export the router for use in the main application
export default router;