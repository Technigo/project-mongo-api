# Mongo API Project 🥭
For this project we were tasked to set up a database to store and retrieve data from and use that data to produce a RESTful API. 

The main requirements were to:
1. Create an API that has at least two endpoints that allows for get request from data stored on the database: One endpoint that returns an array of elements and the second that returns a single element.
2. Follow and implement RESTful methadology when creating the API endpoints.
3. Set up the MongoDB noSQL database.
4. Use Mongoose library to connect to the server and allow for us to interact between the server and clientside.
5. And use Mongoose to create models and attributes that act as instances/blueprint of the dataset that we're using. This will allow for us to store/save the data in the database. 

## The method 🅰️ ➡️ 🅱️
1. As we'd already created an API with a number of different endpoints last week the main thing to learn/understand was how to create the database, how to interact with it using Mongoose and how to adapt our API endpoints using mongoose queries and functions which allows us to access the database. 
2. Set up my MongoDB database and then installed and imported Mongoose. 
3. Implemented the relevant code which allows for the server.js to connect to the MongoDB database.
4. Decided to continue using the same dataset that I used last week, books.json.
5. Created a mongoose model which represents the structure of the objects in the dataset using and which will be the structure for the instances that will be entered into the database.
6. Then seeded the database in order for the dataset using to be saved to the database. As the dataset is an array of objects used forEach() to iterate over each array element.
7. Also implemented deleteMany() function which is called in the beginning of the seeding process. This will delete all data that was previously saved to the database so duplication of data doesn't occur. After this then the data is saved to the database. 
8. Used async and await to help with asynchronous operations when seeding the database and when the different endpoints are getting data from the server as they aren't returned instantly.
9. Created the first endpoint which returns the whole array of data using the model name and the method find(). I also created some queries parameters, like in last weeks project, author, title, language and average rating. For all the query parameters that require a string I used the RegExp() object that matches the pattern of the string entered in the query against the data in the database for that specific attribute/key. I also added the "i" modifier which performs case sensitive matching. 
10. The second endpoint allows for the user to search for book by id. I used findOne() function which allows for that specific id to be queried against the data in the database and returned if a match is found. 
11. I also implemented response status and error messages if the parameters of the different endpoints don't match.

## Technologies & resources used 🧰
1. JavaScript
2. Express.js
3. MongoDB
4. Mongoose library
5. Stackoverflow
6. Google
7. Team mates knowlege
8. Help channel in Slack

## View it live 👀
https://clairebookapi.herokuapp.com/documentation
This url will take you to the documentation. After that it's just a case of choosing which endpoint you want to use!




