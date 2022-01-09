# Mongo API Project

Using MongoDB to store data, to then query that data to return data from created API endpoints.

## Endpoints

GET /
Welcome page

GET /titles
Displays all titles in the database. An error message will show when the title is invalid or no title is found with the provided entry.

GET /titles/id/:id
Displays a single title based on the id parameter from the request URL. An error message will show when the id is invalid or no title is found with the provided id.

GET /titles?type=tv
Will show titles that have type tv shows, search movies to show that type instead. An error message will show up if no type is found.

More queries:
GET /titles?cast=winslet&Leo
Get titles by cast members

GET /titles?title=crime
Get titles that include the word crime

GET /titles?country=sweden&genre=Drama
Get titles from a specific country and genre

## View it live

https://amandatilly-project-mongo-api.herokuapp.com/
