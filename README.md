# Mongo API Project

This week is about using a database to store and retrieve data from and use that data to produce a RESTful API.

## The problem

- How to model data in Mongoose
Imported mongoose and established a connection to DB by specifiing a url and schema for structure

- How to fetch items from a Mongo database using Mongoose
Set up of a couple of paths and query options one of them making use of mongoose operator regex to enable case insensitive searches.

- How to seed large amounts of data to a database
Set up of the variable seedDatabase which by running both update and if neccessary re-writes database (RESET_DB).

## View it live

https://th-project-mongodb.herokuapp.com/

EXAMPLES

ALL SALES: /sales
QUERY: sales?region=BaltimoreWashington
SINGLE ENTRY: sales/_id


- If I had more time
With more time I would have liked looking into how to specify a query or path or perhaps a frontend solotion to:
 - Average price over time
 - Top ten total volume
 - highest notation (combination of avg price and volume)
 - graphical representation