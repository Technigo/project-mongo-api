# Project Mongo API

This weeks project included building an API wiht MongoDB and generate a couple of RESTful endpoints to return an array or single item.

## The problem

I found data on Kaggle that I manipulated slightly to fit my needs. I created the following endpoints:

- "/" Routes
- "/restaurants" All restaurants. Limited to 100 restaurants per page. To see another page, add ?page=2 to the end of the endpoint
- "/restaurants/:name" Filter on name
- "/restaurants/:id" Filter on id
- "/cuisines" All cuisines. Displays a list of all available cuisine types
- "/cuisines/:cuisine" Filter on cuisine
- "/locations/:location" Filter on location
- "/awards/:award" Filter on award (3 stars, 2 stars, 1 star, Bib Gourmand)

## View it live

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.
