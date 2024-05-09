# Project Mongo API

This weeks project included building an API wiht MongoDB and generate a couple of RESTful endpoints to return an array or single item.

## The problem

I found data on Kaggle that I manipulated slightly to fit my needs. I created a model with a Mongoose with all the data about the restaurants. After seeding the data, I created the following endpoints:

- "/" Routes
- "/restaurants" All restaurants. Limited to 100 restaurants per page. To see another page, add ?page=2 to the end of the endpoint. There are 6700 restaurants in total hence 67 pages.
- "/restaurants/:name" Filter on name
- "/restaurants/:id" Filter on id
- "/cuisines" All cuisines. Displays a list of all available cuisine types
- "/cuisines/:cuisine" Filter on cuisine
- "/locations/:location" Filter on location
- "/awards/:award" Filter on award (3 stars, 2 stars, 1 star, Bib Gourmand)

If I had more time, I would improve error handling via middleware. I would also have improved filtering to enable combination of different filters. 

## View it live

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.
