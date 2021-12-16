# Netflix Database API Project

# API DOCUMENTATION

GET "/" - Shows all the data and also enables the possibility to use a query parameter to find the movies and shows from a certain releaseYear and country.

GET "/movies" - finds the movies based on the type.

GET "/tvshows" - finds the tv shows based on the type.

GET "id/:id" - finds the id that matches what the user puts in and shows only that object. If the id written by the user doesnt exist the API will return a error message (404).

# View it live

https://zancotti-mongodb.herokuapp.com/
