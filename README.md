# Mongo API Project

The purpose of this project was to start using database to store and retrieve from and use this data to create a RESTful API.

As last time, the API had to contain a couple of endpoints returning either an array of data or a single item. But this time, I even had to model my own database using Mongoose models and persist the data in a database.

## The problem

I kept to my previous set of data used containing a list of 50 Spotify releases. The suructure of the data set was kind of a challenge during last week. It turned out that it was even more challenging using Mongoose.

I first created a /releases route returning an array of releases.
Then I created a /release/:id route returning a single release with a specified id.

The first endpoint /releases accept filters via query parameterers but, because of the data structure, I could not reproduce the same query params for this endpoint as in the previous project.
Instead, I challenged myself by creating 2 additional collections (types and artists) and referencing to them in the main collection releases. I created 2 separate endpoints (/types and /artists) for these new collections.

To compensate the limitations of the query params in /releases, I created additional endpoints using mongoose's aggregate functions $unwind, $lookup and $match:
- /releases/artist/:artist to return a collection of releases with an artist name containing the specified word(s)
- /releases/title/:title to return a collection of releases with a title containing the specified word(s)
- /releases/type/:type to return a collection of releases with a type containing the specified word(s)
- /releases/market/:market/type/:type to return a collection of releases in the specified market for the specified type

If I had more time, I would have used more of the MongoDB aggregate pipeline to manipulate my data set and sliced the data in different pages. I would even have rebuit the music releases project using different endpoints in my API.

## View it live

You can take a look at the result on https://spotify-releases-v2.herokuapp.com/
You are welcome to visit my pull request https://github.com/Technigo/project-express-api/pull/122 and leave some comments about my code.
Enjoy!