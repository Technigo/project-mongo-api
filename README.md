# Mongo API Project

This is an API using a database I've created.
I created the database using MongoDB and models of data using mongoose.

In this API you can find categories for the Golden Globes and see all nominations for each category.
You can also display all nominations if you'd like to.

## The problem

One issue I had when doing this project was the issue of multiple categories with different id:s, even though the value of the category was the same.
To avoid this I created a set, which I late used in a forEach-loop to seed my database with categories.

## View it live

