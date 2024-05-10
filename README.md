# Project Mongo API

This weeks project included building an API wiht MongoDB and generate a couple of RESTful endpoints to return an array or single item.

## The problem

I found data on Kaggle that I manipulated slightly to fit my needs. I created a model with a Mongoose with all the data about the restaurants. After seeding the data, I created the following endpoints:

- "/" Routes
- "/restaurants" All restaurants. Limited to 100 restaurants per page. To see another page, add ?page=2 to the end of the endpoint. There are 6700 restaurants in total hence 67 pages.
- "/restaurants/:query" Filter on name or ID. Letters will be treated as name search, numbers as ID search
- "/cuisines" All cuisines. Displays a list of all available cuisine types
- "/cuisines/:cuisine" Filter on cuisine (one or several)
- "/locations/:location" Filter on location (city or country)

If I had more time, I would:

- added another filter for awards (1-2-3 stars, bib gourmand)
- improve error handling via middleware
- improve filtering to enable combination of different filters

I've tested the endpoints quite thoroughly and as far as I'm concerned they all work as intended.

## View it live

https://michelin-restaurants.onrender.com/