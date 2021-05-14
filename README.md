# MongoDB API
I've created a RESTful API using Express and MongoDB as part of week 18 of the Technigo bootcamp. 

## Endpoints
* Main path of api: https://caroline-netflix-titles.herokuapp.com/

* The API has the following endpoints:

* /titles
** /titles/year --> query by year
** titles/cast --> query by cast name
** titles/:id

* directors --> query by director name
** directors/:id
** directors/:id/titles --> find all titles of a specific director

### Reflections
I enjoyed working on bettering my code from last week and applying it to the model structure of MongoDB. 

I've used the packages: listEndpoints and dotenv for the project. 

For performance reasons I've only seeded 800 out of 7787 items in the netflix-titles.json to the database. 

If I had more time I would create pages with skip() and limit() and set up aggregations. 

## View it live
https://caroline-netflix-titles.herokuapp.com/