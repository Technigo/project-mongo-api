# Mongo API Project

The assignment was to store and return data in a database using Mongoose models. The project displays a data set of books.   

## The problem
The problem was solved by creating:
- collections to group documents in the MongoDB
- mongoose.Schema to define the structure of the document within the collections
- mongoose.model to wrap the Schema and create an interface to the database
- an async function to seed the database
- mongoose queries such as deleteMany(), findById() and find() to query data 
- RESTful endpoints to return data  

If I had more time I would have created more endpoints, such as rating and number of pages, and try the mongoose aggregate function. I would also like to write a proper API documentation. 

## View it live

https://api-bookfinder.herokuapp.com/ 
