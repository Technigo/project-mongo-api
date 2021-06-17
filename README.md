Project week 18 of Technigo bootcamp

# Mongo API Project

The project was to use a database to store and retrieve data from and use that data to produce RESTful endpoints.

## The problem

In my project I used the top-music.json.

Endpoints:

'/tracks'

Displays all items in the json.

Possible to use the following queries:

?trackname - track name, no need to type entire name to show hits

?artist - artist, no need to type entire name to show hits

---

'/tracks/popularity'

Shows all tracks sorted by popularity

---

'/tracks/:trackId'

Id param to return a single track

---

'/artists'

Displays a dictionary with all artists

---

'/artists/artist/:artist'

Artist param to show all tracks from one artist - no need to type entire name to show hits

---

'/genres'

Displays a dictionary with all genres

---

'/genres/:genre/artists'

Displays all artists in a genre.

Genre param with no need to type entire genre to show hits.

Possible to type for example 'pop' to show artists that has different kinds of pop genres.

## View it live

https://popular-music-api.herokuapp.com/
