# Project Mongo API

We had to use Mongoose models to model data and use these models to fetch data from the database through an API, through a minimum of two routes. We used MongoDB compass to view our database and MongoDB Atlas to ensure our data was available online. 

## The problem

There were many installation problems with MongoDB, Mongoose and Homebrew this week. Once I had installed everything, I coded along to the codealongs. I did not realise I could not re-fork the repo I used for the codealong to start this week’s project, so I commented it out and created a new server.js file, so that I could keep the codealong work. 

For this week’s project, I selected a dataset from Kaggle, converted it into JSON format and imported it into Compass to use. I created two routes - returning the full collection as an array, and a single result by targeting an ID.  I started creating queries but these did not seem to work, and I was running low on time to continue troubleshooting, so I will come back to these in future. 

Deployment also created issues. I had to export the data from Compass and insert it into my VS Code, and then import the data from a JSON file into Server.js which seemed counter-intuitive. Then, although I deployed to Render, I could not access the database via Atlas. This is something I am still in the process of troubleshooting. 

## View it live

https://fiona-klacar-project-mongo-api.onrender.com/

