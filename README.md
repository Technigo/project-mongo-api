# Project Mongo API

Creating a RESTful API using MongoDB as database management system and Mongoose as the Object Data Modeling (ODM) library. The API uses data from a .json file which I've selected and created endpoints from.

## The problem

Had challenges when deploying the database to Atlas and then deploying the project via Render. Going through the sites I realized I had a letter too many in the value of the environment variables. I also choosed deploy a "Static Site" instead of the correct "Web Service", once both bugs were solved it worked.

I added the .env to keep sensitive information. As I had some struggles with the deploy and in my debug I added the API:info in the server.js file again to understand how it might be connected. With more time I would hide it again.

Atlas was used to deploy the database and Render to deploy the project.

## API explained

GET /books
Description: Lists all books

GET /books/:bookID
Description: Replace ":bookID" with an id of your choice

## View it live

[https://first-mongo.onrender.com/](https://first-mongo.onrender.com/)

## Connect with Me

[GitHub](https://github.com/IdahCollin)
[LinkedIn](https://www.linkedin.com/in/idah-collin)

