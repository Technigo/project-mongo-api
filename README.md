# Mongo API Project
This is a project built during the Technigo bootcamp week 18. I continued working with the booksData from the previous week but this time I practised using a database to store and retrieve data from and used that data to produce a RESTful API.

The main goals this week were to learn:
- How to model data in Mongoose
- How to fetch items from a Mongo database using Mongoose
- How to seed large amounts of data to a database
- Learn about environmental variables and how to handle sensitive data


## The problem
- One of the biggest challenges this week was understanding how to go about connecting my database to MongoDB Atlas to get the API server deployed on Heroku. There where a lot of steps to complete and also the matter of learning about environment variables and how to use them correctly to get the right connection.
- I practised creating several different endpoints and learned how to use mongoose operators such as .find(), .findOne() and .findByID() and regular expressions.
- I wanted to practise establising relations between documents in different collections so I created one for books and one for author.
- If I had more time I would like to dig deeper into adding multiple queries and learning about aggregate.

The endpoints that I have created are the following:
- https://sofias-mongo-db-api.herokuapp.com/
  Route to APIs first page listing all possible endpoints

- https://sofias-mongo-db-api.herokuapp.com/books 
  Endpoint to get all books

- https://sofias-mongo-db-api.herokuapp.com/books/book/:bookId
  Endpoint to get single book by id path param

- https://sofias-mongo-db-api.herokuapp.com/books/book/:bookId/author 
  Endpoint to get author by path param id for single book

- https://sofias-mongo-db-api.herokuapp.com/books/search
  Endpoint with search path and query param for title

- https://sofias-mongo-db-api.herokuapp.com/authors 
  Endpoint to get all authors 

- https://sofias-mongo-db-api.herokuapp.com/authors/:authorId
  Endpoint to get author based on id path param

## View it live

https://sofias-mongo-db-api.herokuapp.com/
