# Project Mongo API

 This week I looked at how to use MongoDB to store data, and how to query that data from your API. Again, I used different data that is not provided by Technigo. I chose to retrieve data from Kaggle and convert it to JSON file. I also learnt some methods such as;
 find()
 findOne()
 findById()
 limit()
 sort()
 select()

## The problem

Problem -> solution

- npm run dev didn't work -> seems like many other students had it as well, so the fixed was to downgrade node from v18 to v16.
- sensitive case -> found out that I cannot use toLowerCase() in mongoDB, and looked on some documentation that I had to use regExp 'i'.
- math symbol -> again, mongoDB has different way. Instead of >= (bigger than) I had to use $gte which also means greater than or equal.
- query within params -> spent so much time Googling and did trial and error. But I ended up experimenting with my own logic and it worked.

## View it live

https://project-mongo-api-thr246hagq-lz.a.run.app/