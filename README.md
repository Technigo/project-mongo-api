# Project Mongo API

In this project a API was created by me using Express JS, MongoDB and Mongoose models. I used a dataset provided by Technigo that has 1375 Netflix titles and some data about them. The implementation involves the strategic use of Mongoose queries and the establishment of RESTful endpoints.

### The problem

Describe how you approached to problem, and what tools and techniques you used to solve it. How did you plan? What technologies did you use? If you had more time, what would be next?

### View it live

https://project-mongo-api-netflix-shows.onrender.com

## Netflix Titles Database API Documentation

### Endpoints

#### 1. Get API Documentation

- **Endpoint:** `/`
- **Method:** GET
- **Description:** Returns documentation of the API using Express List Endpoints.

#### 2. Get Collection of Netflix Shows

- **Endpoint:** `/netflix-shows`
- **Method:** GET
- **Description:** Returns a collection of Netflix shows.

#### 3. Get Single Netflix Show by ID

- **Endpoint:** `/netflix-show/:id`
- **Method:** GET
- **Description:** Returns details of a single Netflix show identified by its ID.

#### 5. Filter Netflix Shows by Type

- **Endpoint:** `/netflix-shows/type/:type`
- **Method:** GET
- **Description:** Returns a collection of Netflix shows filtered by type. The `type` parameter can be either "movie" or "tv%20show".
