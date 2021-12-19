# Mongo API Project

Frontend built with React to display book data from an API. API built with MongoDB and deployed with Heroku.

Path: /books
Shows all books available

Path: /books/:id
Shows you the book with matching id

Path: /books?= query param
Available query params are title and author built with regular expressions with methods as include and no case sensitivity

Title: ?title=enter title

Author: ?authors=enter author

Path: /books/pages/shortbooks or /mediumbooks or /longbooks
Shows you books matching a range of pages

Short books: Less than 350 pages

Medium books: Between 350 pages and 799 pages

Long books: Greater and equal to 800 pages

Path: /books/ratings/lowrating or /mediumratung or /highrating
Shows you books matching an average rating score

Low rating: average rating less than 2.5

Medium rating: Average rating between 2.5 and 3.6

High rating: Greater and equal to 3.7

## The problem

Used regurlar expressions and mongoose operators to build endpoints. Heroku to publish and react for frontent.

## View it live

https://carling-bookdata-api.herokuapp.com/
https://carling-bookapi-frontend.netlify.app/
