Documentation of the API's endpoints

path: '/'
It gets all the data from the MongoDB.

path: '/endpoints'
Listing of all the available endpoints.

path: '/search'
Filtering the data by country or director or by both of them.

path: '/year/:year'
Filtering the data according to year of release.

path: '/type/:type'
Filtering the data according to type of content. There are two alternatives: "TV Show" or "Movie".

path: '/titles/:id'
Searching for a unique title using MongoDB's ObjectId.
