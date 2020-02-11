# Mongo API Project

I built an API using MongoDB and Mongoose models. I used Kaggle to find the dataset and built the endpoint with queries from what I thought suited the data (search for name or/and year. Sort by increasing rank with: sort=rank or sort by decreasing average with: sort=average)

## The problem

At first I used find() to get all the data to be able to sort it with vanilla JS-methods (like sort and slice). When I started reading the mongoDB documentation I realized all the possibilities, and replaced it with mongoDB-methods such as sort, skip, limit etc. The advantage was that every request was narrowed down before find(), instead of using find() to request everything and then sorting out what should show. If I had more time I would've written more error-catching.

## View it live

https://boardgames-mongo.herokuapp.com/boardgames

#### Examples with queries:
https://boardgames-mongo.herokuapp.com/boardgames?name=cards&sort=average
https://boardgames-mongo.herokuapp.com/boardgames?year=2010&page=2
