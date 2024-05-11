<h1 align="center">
  <a href="">
    <img src="/public/quizzi.png" alt="Project Banner Image">
  </a>
</h1>

# Project Mongo - QUIZ API

This project is my second backend project, using MongoDB, Mongoose, to create an API. I chose to do a quiz with 500 questions of different categories. 

## The problem

This project was about learning some new backend tools, like mongoose schemas and models, .env, mongoDB compass and atlas. I put a lot of time into trying a json file of wine that I found on Kaggle but it contained an objectsId that had a $, and it was not accepted no matter how I twisted and turned, I ended up changing the json after reading comments online where others had the same issue without a solution. But it was actually good for me, because it motivated me to create a frontend project for my data (quiz generated partly with ChatGpt and myself correction). Backend with decided data is fun but it's not my strong suit since I like to envision the frontend and come up with ideas and identities.

## View it live

https://quiz-api-3a1v.onrender.com/

Endpoints are:  /questions
                /questions?page=2
                /question/:id
                /category/:category
                /difficulty/:difficulty