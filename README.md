# Project Mongo API

In this project we have created our own RESTful API and then used Mongoose methods when, for example, filtering the data.

## The problem

I found this project harder to set up than the one last week. The deployment was also trickier but within my team we helped eachother out a lot. To write the code I have looked at the provided material, discussed with team mates and chatGPT.

In this project I have used a dataset from Kaggle: https://www.kaggle.com/datasets/jonbown/metallica-songs?select=metallica_songs.csv

Please note that there can be several albums with similar names because in the dataset remastered and live albums are also included.
In "/songs/:id" you can in the URL change ":id" to one of the MongoDB generated id:s that you find in every song on the "/songs" list.
In "/song-name/:title" you can replace ":title" with a song title that you find in the "/songs" list. It should include a partial match, for example if you type in "/song-name/ride" it should show songs from the album Ride the lightning.
In "/albums/:album" you can show songs from certain albums, and you can also choose to see what songs in that album have a popularity score equal to or higher than, for example 55, by typing in "/albums/ridethelightning?popularity=55"

## View it live

Please visit: https://mongoapi-fkkq.onrender.com
