# Mongo API Project

Model a database using Mongoose and produce restful Api.

## The problem

I used same Netflix dataset as in previous project. Having difficulties finding motivation I'm glad I didn't just give up and minmimum requirements are met.
If I had more time I would add a title with reg ex for enabling intuitive search, as well as a year endpoint and limit the amount of movies per page. Also change the director ref type as it would make more sense to have an object id type per country instead of director.
Add a title with reg ex for enabling intuitive search, as well as a year endpoint.


## View it live

https://simple-mongo-db.herokuapp.com/

Endpoints:
 https://simple-mongo-db.herokuapp.com/shows   /returns whole array of netflixdata 
 https://simple-mongo-db.herokuapp.com/shows/81171862    /returns single show based on json.show-id 

 https://simple-mongo-db.herokuapp.com/shows/director/546f6b61204d634261726f72   /returns show(s) by director db created objectId 
