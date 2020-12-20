# Mongo API Project

Continuing from last weeks introduction to backend and serverside programming, we moved on to learning MongoDB. We were to investigate the relationship between servers, API's and the frontend by connecting all dots ourselves.

## The problem

I decided to work with the same dataset this week as last week, as I figured it might clarify the benefits of working with MongoDB. I started off by connecting my data to mongoose and making sure I got my local server up and running in Compass. 

After building my first models and seeding the database I created a couple of endpoints and got all the basics up and running. Mid week we had a lecture with Maksymilian where he showed us three different ways to write the asynchronous syntax in the endpoints. 

My dataset was a little special, so for pure learning-purposes I decided to remove a double set of quotes manually to be able to use the array of tags without having to create another program to modify the data. 

I decided to use the .populate-method to connect my three collections of data, which opened up for a cleaner way to display talks based on event or speaker.

If I'd had more time, I'd come up with a way to make the user be able to combine multiple categories in a query as well as adding categories as it's own collection.


## View it live

Live demo: https://tedtalks-powered-by-mongo.herokuapp.com/
Documentation: https://github.com/karinnordkvist/karinnordkvist-Technigo-17-20-Mongo-API/blob/master/Documentation.md