# Mongo API Project

The aim of this project was to learn how to use Mongodb; storing data, fetching data, finding data and returning error messages when the data could not be found etc. The project was based on an express-API, however this time I used Mongoose methods to interact with the data. I downloaded a dataset from Kaggle and then converted the CSV into JSON format, which I added to my database.

## Documentation
 GET /
 Welcome page

 GET/winners
 Displays all recipients of the Nobel Prize

 --Query Params--

 The query params are based on the /winners endpoint. Using 'let allWinners = await Winner.find(req.query)' in the code, means the user can find a lot of information with queries.

Examples:
       
GET /winners/?gender=female
will display all female winners

GET /winners/?bornMonth=May
will display all recipients born in May and so on.....

GET /winners/?ageGetPrize=35
will display all recipients who were aged less than 35 years when they won the award

--Path Params--

GET /winners/category/:category
displays all winners in any specified category

GET /winners/year/:year
displays all winners in any specified year

GET /winners/surname/:surname
displays winner(s) with a given surname (surname must be given capitalised)

GET /winners/id/:id
returns one winner with inputted id (the unique id assigned by Mongodb)

## View it live

https://nobel-prize-mongo.herokuapp.com/