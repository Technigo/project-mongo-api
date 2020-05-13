# Mongo API Project

This project was to model my database using Mongoose models, and persist data in the database. The requirements wre to have a least two routes and have a restful API.

## The problem
I was having trouble with the query's I was not quite sure on how to place it in the line of codes. 
  const { query } = req.query
   if (query) {
    //localhost:5000/shows?query=Showtype 
    const queryRegex = new RegExp(query, 'i')
    const shows = await Show.find({ type: queryRegex })
    res.json(shows)
   } else {
    //localhost:5000/shows
    const shows = await Show.find();
    res.json(shows)
   }
   It became easier for me to understand on how and in what order once I commented it out. 


## View it live

https://project-mongo-api-by-tuliany.herokuapp.com/
