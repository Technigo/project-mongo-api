# Project Mongo API

This project builds a RESTful API for a Netflix title database using Mongoose for data modeling and persistence. It allows users to retrieve all Netflix titles or a specific title by ID, with optional filtering capabilities based on various title attributes.

## The problem

Approach:
1. Data Modeling: Defined a Mongoose schema (netflixTitleSchema) to represent Netflix title data with properties like title, director, cast, country, etc.
2. Database Persistence: Established a MongoDB connection and used Mongoose to create a model (NetflixTitle) for interacting with the database.
3. Seed Data: Implemented a function (seedDatabase) to populate the database with Netflix title data from a JSON file (netflixTitlesData.json). This function deletes existing data before seeding and handles missing fields by setting them to "Unknown".
4. API Endpoints: Developed three API endpoints:
/: Returns API documentation using expressListEndpoints.
/netflixTitles: Retrieves all Netflix titles with optional filtering based on query parameters (title, director, cast, etc.) using Mongoose queries.
/netflixTitles/:netflixId: Retrieves a single Netflix title by its ID using Mongoose's findById method.
5. Error Handling: Implemented error handling middleware to check database connection status and provide appropriate error messages in case of issues.

The most difficult part was getting the localhost and the atlas db working. 

## View it live

https://netflix-titles-api.onrender.com/
