# Mongo API Project

First time creating and populating a database (MongoDB), and developed an API on top of that with Mongoose.

## The problem

I knew the data since before so the time was spent on analyzing what endpoints would make sense from a REST point of view, and
understanding and writing the Mongoose syntax. I was inspired by Bokus online shop to come up with meaningful endpoints for frontend to use.

## View it live

https://project-book-api-mongo.herokuapp.com/

## Endpoints

All endspoints will be limited to show the first 20 items in the queried dataset.

https://project-book-api-mongo.herokuapp.com/books - queries all books in the dataset

https://project-book-api-mongo.herokuapp.com/books/5fdcf9581b727a002a3d314b - queries one book in the dataset identified by it's _id

https://project-book-api-mongo.herokuapp.com/books?search=anna - with search you query on title and author name

https://project-book-api-mongo.herokuapp.com/books?language=spa - queries on language, exampels: eng, spa, en-GB, en-US, ara

https://project-book-api-mongo.herokuapp.com/books?sort=pages-asc - queries on sorting, where you have either pages-asc or rating-desc, see below

https://project-book-api-mongo.herokuapp.com/books?sort=rating-desc

https://project-book-api-mongo.herokuapp.com/books?search=john&language=en-US&sort=rating-desc - you can combine the queries as you wish, with search, language and sort

