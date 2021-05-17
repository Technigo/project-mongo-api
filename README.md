# Mongo API Project  
This API can be used e.g. to create exercise programs.

## Available endpoints and queries

### All exercises  
/exercises

### Find exercise by id  
/exercises/exerciseId

### Search exercises by name and target muscle  
* examples
how to find all deadlift variations:  
/exercise?name=deadlift  

how to find all exercises with target muscle gluteus maximus:  
/exercise?targetMuscle=gluteus 

### All multi-joint exercises  
/category/multi-joint

### All single-joint exercises  
/category/single-joint

## Learning goals

How to:
* model data in Mongoose
* fetch items from a Mongo database useing Mongoose
* seed large amounts of data to a database
* store secret information such as database passwords
* return useful error messages from API endpoints

Techniques used:  
* Node.js
* MongoDB and Mongoose
* NoSQL

## View it live

https://exercises-api-mongodb.herokuapp.com/