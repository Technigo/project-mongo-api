# Mongo API Project

API created with Express & MongoDB.

## Description

Available endpoints:

Routes | Path
--- | ---
root | `/`
shows | `/shows`
show by id | `/shows/:id`

Queries can be used to filter the `/shows` endpoint.

Query | Path | Value
--- | --- | ---
title | `?title=:title` | *string*
type | `?type=:type` | *'movies' / 'tv-shows'*


## Tech
- Mongo DB
- Mongoose
- Express
- Node.js
- Javascript


## Deployed
https://mongo-api-netflix.herokuapp.com/
