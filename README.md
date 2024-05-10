# Project Mongo API

This week, I worked on building a simple API using MongoDB. It includes four routes, with one ("/") dedicated to API documentation. The others allow fetching a collection of items, a single item, and filtering items by color. I used Mongoose models for data handling, sticking to RESTful principles throughout.

## The problem

For database I used a flowers data similar to the one Jennie used in coding session the last two weeks but I added inStock. Challenges included setting up MongoDB, defining data models with Mongoose, and handling asynchronous operations. Techniques involved in this project was environment variables, middleware for CORS and JSON parsing, error handling, and async/await for database operations. I wanted to add a filter for inStock=true and inStock=false but couldn't make it work so I skipped.

## View it live
https://project-mongo-api-wncr.onrender.com/
