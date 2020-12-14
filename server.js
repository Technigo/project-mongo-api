import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
 import albums from './data/albums.json';


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

/*SEED THE DATABASE*/
const Album = mongoose.model('Album', {
  // Properties defined here match the keys from the people.json file
  number : Number,
  year : Number,
  album : String,
  artist : String,
  genre : String,
  subgenre : String
});

if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    console.log("seeding database");
    await Album.deleteMany({})

		albums.forEach((albumData) => {
			new Album(albumData).save()
		})
  }

  seedDatabase();
} 


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

/*COLLECTIONS*/ 
//Get all the albums from the database .
app.get('/api/albums',async (req,res) => {
  
  const filterYear = req.query.year;
  const filterArtist = req.query.artist;
  const filterGenre = req.query.genre;
  const page = req.query.page || 1;
  const pageSize = 50;
  const skipIndex = pageSize * (page - 1);

  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;
  let sortQuery = { number : 1};
  
  let artistFilter = null;
  let yearFilter = null;
  let genreFilter = null;
  let filterArray = [];


  //Check if there are sorting parameters in the query. If not, the default is used. If one param, the other param is default.
  if(sortBy || sortOrder){
    const querySortBy = !sortBy ? "number" : sortBy.toLowerCase();
    const querySortOrder = !sortOrder ? 1 : sortOrder;
    sortQuery = {[querySortBy] : querySortOrder};
    console.log("SortQuery" , sortQuery);
  }

    if(!filterYear && !filterGenre && !filterArtist){
    console.log("no query filters, get all the albums");
      console.log("skipIndex:", skipIndex);
      console.log("Limit:" , pageSize);
    const albumsData = await Album.find().sort(sortQuery).skip(skipIndex).limit(pageSize);
    //.limit(pageSize).skipIndex(skipIndex);
     if(albumsData){
        res.json(albumsData);
      }
      else{
        res.status(404).json({ error : "Not Found"});
      };
    }

    //Filters NEW START

  
   if(filterYear || filterGenre || filterArtist)
   {
     console.log("Found query parameters"); 
    if(filterArtist){
      artistFilter = { artist : filterArtist };
      filterArray.push(artistFilter);
      }
      if(filterYear){
      yearFilter = { year : filterYear };
      filterArray.push(yearFilter);
      }
      if(filterGenre){
      genreFilter = { genre : filterGenre };
        filterArray.push(genreFilter);
      }
      console.log(filterArray);
    
      const albumsDataFiltered = await Album.find({$and: filterArray}).collation({locale: "en", strength: 2}).sort(sortQuery).skip(skipIndex).limit(pageSize);
      res.json(albumsDataFiltered); 
   }


    //Filter NEW END


    /*
    //Backlog - how to filter on everything at the same time? 
    if(filterArtist){
      console.log("filter is artist", filterArtist);
      const albumsDataFiltered = await Album.find({artist : new RegExp(`^${filterArtist}$`, 'i')}).sort(sortQuery);
      res.json(albumsDataFiltered); 
    }
    if(filterYear){
      const albumsDataFiltered = await Album.find({year : filterYear}).sort(sortQuery);
        res.json(albumsDataFiltered); 
    }
    if(filterGenre){
      //.collation({locale: "en", strength: 2});
      const albumsDataFiltered = await Album.find({genre : new RegExp(`^${filterGenre}$`, 'i')}).sort(sortQuery);
        res.json(albumsDataFiltered); 
    }
   
*/
    /*if(filterArtist){
      console.log("Filter on artist and year");
      const albumsDataFiltered = await Album.find({Artist:"The Beatles"});
      res.json(albumsDataFiltered);
    }*/
  }

)

//Special endpoint for testing purposes
//{ artist: "The Beatles", year : 1966 }
app.get('/api/albums/filterAll',async (req,res) => {

  const artistParam = "the beatles";
  const yearParam = 1966;
  const genreParam = "Rock"; 
  let artistFilter = "";
  let yearFilter = null;
  let genreFilter = "";
  let filterArray = [];

 if(artistParam || yearParam || genreParam)
 {
  if(artistParam){
    artistFilter = { artist : artistParam };
    filterArray.push(artistFilter);
    }
    if(yearParam){
    yearFilter = { year : yearParam };
    filterArray.push(yearFilter);
    }
    if(genreParam){
    genreFilter = { genre : genreParam };
      filterArray.push(genreFilter);
    }
    console.log(filterArray);
  
    const albumsDataFiltered = await Album.find({$and: filterArray}).collation({locale: "en", strength: 2});
    res.json(albumsDataFiltered); 
 }
 
});

//Get top10  albums from the database .
app.get('/api/albums/top10',async (req,res) => {
  const topTenAlbums = await Album.find().sort({number : 1}).limit(10);
  res.json(topTenAlbums);
}
)

//Get bottom10  albums from the database .
app.get('/api/albums/bottom10',async (req,res) => {
  const bottomTenAlbums = await Album.find().sort({number : -1}).limit(10);
  res.json(bottomTenAlbums);
}
)

/*Single Items*/

//Get by placement in list 
app.get('/api/albums/placement/:placement', async (req,res) => {
  const placement = req.params.placement;
  const singleAlbumFiltered = await Album.findOne({number : placement});
  res.json(singleAlbumFiltered); 
})

//Get by album title
app.get('/api/albums/title/:title', async (req,res) => {
  const title = req.params.title.replaceAll('+',' ');
  console.log({title});
  const singleAlbumFiltered = await Album.findOne({album : title}).collation({locale: "en", strength: 2});
  res.json(singleAlbumFiltered); 
})






// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
