# MongoDB API
I've created a RESTful API using Express and MongoDB as part of week 18 of the Technigo bootcamp. 

## Endpoints
The API has the following endpoints

| Path                                          |      Description                                   |
| :------------------------------------------- | :------------------------------------------------ | 
| /                                             |                                                    | 
| https://caroline-netflix-titles.herokuapp.com/|  Welcome page - contains a list of available routes|
| /titles                                       |  all titles                                        |
| /titles/year                                  |  query titles by year                              |
| /titles/cast                                  |  query titles by cast name                         |
| /titles/:id                                   |  lookup title by id                                |
| /directors                                    |  all directors / query director by name            |
| /directors/:id                                |  lookup director by id                             |
| /directors/:id/titles                         |  all titles by a specific director                 |

## Tech

- MongoDB
- Mongoose
- Node
- Express
- JavaScript
- Heroku
- MongoDB Atlas & Compass
- Postman

### Reflections
I enjoyed working on bettering my code from last week and applying it to the model structure of MongoDB. 

I've used the packages: listEndpoints and dotenv for the project. 

For performance reasons I've only seeded 800 out of 7787 items in the netflix-titles.json to the database. 

If I had more time I would create pages with skip() and limit() and set up aggregations. 

## View it live
https://caroline-netflix-titles.herokuapp.com/