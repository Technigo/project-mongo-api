# Mongo API Project 18


Mission was to use a database to store and retrieve data from and use that data to produce a RESTful API.
Also to model the database using Mongoose models, and persist the data in the database.

- Error handling using Try/Catch.
- Using environment variables.
- Using async/await.
- Seeding a database locally and externally.
- Deployed to Heroku and MongoDB cloud.

Using VS Code, MongoDB Compass, Postman and Chrome.

#### Tech used: 
- Node.js, Express, MongoDB, MongoDB Atlas and JavaScript ES6
- VS Code, MongoDB Compass, Postman and Chrome.

## 

- Root:
https://project-w18-mongo-api.herokuapp.com/ <br>

- To return all Books:
https://project-w18-mongo-api.herokuapp.com/books/ <br>

- To return ONE Book via ISBN nr:
https://project-w18-mongo-api.herokuapp.com/books/312405545 <br>

- Sort by rating:
https://project-w18-mongo-api.herokuapp.com/sort?sort_by=average_rating <br>

- Return one book info by id:
https://project-w18-mongo-api.herokuapp.com/info/5eba83e3b3b1c00023249494 <br>


## The problem

I started off by implementing a mongoose model for my database. I then did a local seed to MongoDB and started working on the endpoints. I needed to do some changes in the model and did a new database seed. Kept on working on the endpoints and handling errors. 
When everything worked locally I first deployed to Heroku. Also set up MongoDB Atlas. Tested first with a empty database and then did a seed to MongoDB Atlas using Heroku Config Vars and "RESET_DATABASE=true" to run my seed to db. 

## View it live 🔝

