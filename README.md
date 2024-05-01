# Project Mongo API

This week we're using MongoDB

## The problem

I had some issues installing everything and the npm run dev stopped without doing everything. After deleting and cloning the repo again, and also updating a bunch of stuff, it finally started working.

I used the same dataset as last project, and copied all my routes. Then I switched them out from express to mongoose.
Haven't done anything fancy, just kept it pretty basic. Looked in the mooongose documentation for how to do the queries.
_I believe there's a lot of stuff to read up on to really get the hang of this, which will take more time than I have within this project._

It was tricky to deploy the project with the database. I think I did it correctly, but I had to add RESET_DB to the start commang in render...

### Next

- If I have time, I will create another model for Authors and cross match them, as Damion did in the code along...
- Maybe I'll add more to the data set aswell, such as genres, and create some models and routes with that.

## View it live

[View Mongo API on render](https://project-mongo-api-d9ql.onrender.com)
