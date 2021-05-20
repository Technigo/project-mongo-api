# City of birches

The goals of this project were to practise modelling data in Mongoose, fetching items from a Mongo database using Mongoose and seeding a large amount of data to a database.

## The problem

I wanted to use some data of interest to me. As I have studied landscape architecture I am familiar with trees. I found open data from municipality of Umeå with trees that are taken care of by the Park department. The original json that I could download from their open data site was a bit complicated with weird param naming and lots of nested objects and arrays. So I downloaded an excel file instead and changed it up a bit. Then I saved it as a CSV file and used a web app, csvjson.com to convert it to json. 

After watching the course video guides and code sessions I got things to work quite smoothly. I saw the mongoose find and findOne in the lectures and during our team demo I found out about Mongoose distinct method which I used to get a list of all tree species in the collection.

Deploying on Atlas and Heroku was a bit tricky and I got stuck before getting hints on Slack and discussing it with my team. 

I would have liked to use the geodata somehow but that is something I could try another time. Since I haven't tried using it I am not sure I chose the right type of data for the latitude and longitude field. A future goal would be to try using some of Mongo's geospatial query operators.

## View it live

Root endpoint

https://umea-trees.herokuapp.com/

All trees endpoint 
with possibility to query with ?name=betula  for example

https://umea-trees.herokuapp.com/trees

Tree by ID endpoint

https://umea-trees.herokuapp.com/trees/id/:id

All tree species

https://umea-trees.herokuapp.com/trees/species 