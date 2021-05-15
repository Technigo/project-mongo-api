# Mongo API Project

This weeks project was to create a RESTful API using Express and MongoDB. 

## The problem

My biggest issue came after deploying it on Heroku. I could get the first page to work just fine but the other endpoints did not work, just came an empty []. I tried solving it for a while and then got some help. Needed to add REST_DB as a key in Heroku settings. 
Other than that, it went quite smoothly. 
If I would have had more time I would have made an API documentation and a frontend.

## View it live

https://move-times.herokuapp.com/

Different endpoints: 
* /all - lists all movies and tvshows. Available queries are title, genre, releaseYear, country, sort and page. You can sort on releaseyear and there is a limit on 20 results per page. 
* /movies - lists all movies and available queries are sort and page (same as above).
* /tvshows - lists all tvshow and available queries are sort and page (same as above).
* /all/:id - param to search for id.

Endpoint examples: 
https://move-times.herokuapp.com/all?sort=oldest&page=2
https://move-times.herokuapp.com/movies?country=brazil&page=1
https://move-times.herokuapp.com/tvshows?genre=drama&sort=newest


