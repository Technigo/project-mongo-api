# Mongo API Project

Project for week 18 of the Technigo Front End Development Boot Camp was to use a set of data, model the database using Mongoose models and to persist the data in the database.

## The problem

Minimum requirements:

- Your API should have at least 2 routes
- A minimum of one endpoint to return a collection of results (array of elements)
- A minimum of one endpoint to return a single result (single element)
- Your API should make use of Mongoose models to model your data and use these models to fetch data from the database
- Your API should be RESTful

I made my own database consisting of international fashion designers – their first and last name, the year they were born and if the brand is allowed to be labelled as haute couture by the of the Chambre Syndicale de la Haute Couture\*. My aim is to make an additional endpoints that filters the boolean value if the designer is indeed a haute couture member, and also to make an endpoint that filers if the designer was born before or after the turn of the 20th century.

This project also included being deployed Heroku (or similar hosting service), as well as deploying the database using Mongo Cloud (or similar). I found it quite exiting to create the .env file, importing it and using the configuration – and then adding it to the .gitignore file. It was my first experience ever modifying the .gitignore and prevent sensitive data from being published. I also got my head around how to use express-list-endpoint to create the initial page of the API with all possible endpoints.

\*To earn the right to call itself a couture house and to use the term haute couture in its advertising and any other way, members of the Chambre Syndicale de la Haute Couture must follow specific rules:

- design made-to-order for private clients, with one or more fittings;
- have a atelier in Paris that employs at least fifteen staff members full-time;
- have at least twenty full-time technical people, in at least one workshop (atelier); and
- present a collection of at least fifty original designs to the public every fashion season (twice, in January and July of each year, of both day and evening garments.\*

Source: https://en.wikipedia.org/wiki/Haute_couture

## View it live

To view the project live, please follow this link (examples of endpoints are also specified in the server.js file comments):

https://designers-api.herokuapp.com/
