# Mongo API Project

The purpose of this project was to learn about using Mongo database and connecting to it

## The project

I had some problems with deploying the database. Just setting the env key on Heroku didn't connect my app to the Mongo Atlas database. I followed a video guide provided by Karol to try to set up the env variable as a file in the project but for some reason the app always overlooked this variable and went with the string provided as an else. So I had to put the database url in the string, I put the sensitive data in a seperate file that I included in the gitignore to protect the data, but the app crashed in Heroku when the variables were excluded from the deploy due to them being in the gitignore. So for now my sensitive data are visible for the world, unfortunately. Hopefully I will get som clearity to why my env variable wasn't working in next week.

## View it live

https://sandra-project-mongo-api.herokuapp.com/
