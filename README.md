# Project Mongo API

The purpuose of this project is to learn how to use Mongodb to store data, and how to query that data from your API.
I am using a dataset provided by Technigo. The endpoints you can look for are: 

../books (will return aray of books)
<br>
../books/:id (find a book by id)
<br>
../books/title/:title (find a book by title)

## The problem

There have been issues deploying the project with heroku. At the beginning the problem was solved after adding a key/value to the "config var" in Heroku and also signing up to a mongo cloud to be able to upload my new dataset. But in the process I ended up having two different deploys on Heroku from this week's project (one still recieving application error and the other one working connected to mongo cloud).

Next issue was seeing all new commits going to the broken link. So I had to break the connection with the broken link and then push all commits to the working link. This was solved with some useful command lines in terminal.  

## View it live

https://booksfor-mongo-api.herokuapp.com/

