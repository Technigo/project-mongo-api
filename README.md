# Mongo  API Project
This week's project is the first introduction to Mondo db🥇. I was inspired by last weeks project An API created using express.The RESTful endpoints created returns data from a hard coded data set about song, such as authors, title, number of pages and song id.

## The built and challanges
Usig a hard-coded set of data, stored as a JSON file "songs.json", which I research and found on external source  which includes 500 top rated songs according to the rolling stones magazine. I downloaded the cvs file and exterted it into a JSON.file Then I created API endpoints in server.js file
My Schema included the following: 
const songSchema = new mongoose.Schema({
  title: String,
  description: String,
  artist: String,
  released: String,
  writers: String,
  producer: String,
  position: Number,
  id: Number
});

This allowed me to create different endpoints using array methods such as filter() .find() and Slice() to select, filter, or limit the items returned in my responses.

Here are the GET endpoints creates so far 

✅ https://saras-mongo-api.herokuapp.com/ Main root is '/' = here you can view all endpoints set up

✅ https://saras-mongo-api.herokuapp.com/songs All songs

✅ https://saras-mongo-api.herokuapp.com/songs/top-rated returning all top rated songs (that has been on the bilboard)

✅ https://saras-mongo-api.herokuapp.com/songs/song/:id End point that returns one song

✅ https://saras-mongo-api.herokuapp.com/songs/artist/:artist for search for specific artist, using params 

✅ https://saras-mongo-api.herokuapp.com//songs/title/:title for search for specific title, using params 


👉I aim to also include pagnation, so I can limit amount of songs, rendered per page. If i had more time I would also include making my own data set. 

### Tech
👉Express 👉Node.js 👉JavaScript

#### View it live
Backend deployed here: https://saras-mongo-api.herokuapp.com/
Frontend deployed here: https://greatest-songs-500.netlify.app/
Frontend code here: https://github.com/Sartish/API-Music-frontend

