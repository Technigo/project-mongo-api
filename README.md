# MongoDB API

**Mission:** 

*Create a RESTful API using Express and MongoDB*

**Requirements:**
- 🔵 COMPLETE (all)
- 🔴 Partial
- ⚫ Partial


***

## Installation

Navigate to the project folder and run the following command

```
$ npm install
```

**To start the server**

```
$ npm run start
```
**To start development**

```
$ npm run dev
```
<br>

## ✅ Features ✅
***
*The following are the main features of this application:*
  
  * Main path of api: https://ufosights.herokuapp.com/
  * The API has the following endpoints:
    * `/sightings`
      * resp => a list of sightings based on queries
      * This endpoint has the following queries available:
        * `yearRange` - eg. `1997-2011`. returns data between two specific years.
        * `countries` - eg. `us,gb,fr`. Can be single value or multiple values seperated by commas. Only accepts IBAN Alpha-2 country codes.
        * `shapes` - eg. `circle,triangle`. Can be single value or multiple values seperated by commas. To get full list of available shapes in db use `/lists/shapes` endpoint
        * `near` - eg. `-123.3272222,42.4391667`. The coordinates must be listed as **longitude** first and then **latitude** (seperated by comma no spaces).
          * `miles` - eg. `50`. Default: `250`. This value is only used if `near` query is provided. This value determines how far away from the **near** coordinates the query is calculated with.
        * `sortBy` - eg. `countries`. Sorts the items based on the param. See `sighting` schema for available params.
        * `orderBy` - eg. `asc`. Default: `desc` Switches the sorting order.
        * `limit` - eg. `10` Default: `25`. affects pagination. Determines how many items is recieved
        * `start` - eg. `2` Default: `1`. affects pagination. Determines what page is to be recieved
      * error => 403 if user provided a query that is not available
      * error => 400 if the queries did not match any data
    * `/sightings/:id`
      * resp => a single sighting object (must be MongoDB Object ID)
      * no pagination
      * error => 403 if user tries to add queries
      * error => 404 if ID provided does not exist
    * `/lists/preInternet`
      * resp => a list of sightings before 1983
      * error => 403 if user tries to add queries
    * `/lists/postInternet`
      * resp => a list of sightings after 1983
      * error => 403 if user tries to add queries
    * `/lists/shapes`
      * resp => a list of shapes
      * error => 403 if user tries to add queries

<br>

## 💭 Reflections 💭
***
It was really great to work on this kind of project. I enjoyed taking my code from last week and applying it to the model structure of MongoDB.

<br>

Issues that came up:
- none of note 


If I were to continue on this project / start over I would:
- provide API documentation
- work a bit more with GEOSpatial JSON objects and set up some cool aggregations for that. 

<br>

***

## Try it live
https://ufo-sightsmongo.herokuapp.com/