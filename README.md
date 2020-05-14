# Mongo API Project


For this project I created a backend with multiple endpoints and query parmeters using mongoDB and express.

## The problem

I used the find() and findOne() query methods with params and queries to return items from the database. 
I found that the .limit .skip and .sort methods were very useful for cutting down the amount of 
logic and lines of code necessary to allow multipe queries to be used at once, such as keyword, order and page.

I created a function to generate random title/author pairings as well as fake rating/page information. To do this
I created an array with a number of null items and then ran a forEach on it to create many new Books, which took
their title and author from indidviual arrays using Math.random(). 

## View it live
https://philo-biblist.herokuapp.com/

