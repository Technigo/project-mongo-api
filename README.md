# Project Mongo API
This project builds upon the previous one, focusing on modeling the database using Mongoose models and persisting data within the MongoDB database. 

## The problem
During the deployment phase, a challenge arose where the data wasn't displaying detailed information within the body of the response. To address this issue, I obtained the answer from the Technigo's stackoverflow. When I deploy the project, I should take an extra step RESET_DB to populate the database or have it in a .env file. In the deployed version I need to run RESET_DB = true npm run dev in the start command. 


Another issue is that I have been sick this week, which has hindered the ability to create a front-end version at this moment.However, I have created a front-end version in the previous project, so I have gained some basic understanding of how the database and Express are implemented on the front end.

## View it live
https://book-mongo-api.onrender.com/
