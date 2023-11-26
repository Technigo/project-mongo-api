# Project Mongo API

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

This week's project is a continuation of the previous one, emphasizing the adoption of Mongoose methods over plain JavaScript. This shift enhances the API's capabilities in various tasks, particularly in filtering.

The construction of a resilient RESTful API further elevates functionality through the integration of a database, ensuring seamless data storage and retrieval.

## Approach and Technologies Used

Folder Structure:
The project adopts a modular organization with distinct directories for models, routes, and the primary server file.

- models/:
  This directory houses Mongoose models specifically designed for handling data related to books.

- routes/:
  The routes folder encompasses endpoints for various book-related functionalities, including the general list of books, sorted books by author, bookID, and language code.

Database Connection:
The project establishes a connection with a MongoDB database hosted on MongoDB Atlas. The secure connection string is stored in the .env file to maintain confidentiality.

Express.js:
Express.js is the framework of choice for building the API. It facilitates efficient handling of routing and managing HTTP requests.

Mongoose:
Mongoose serves as the Object Data Modeling (ODM) library in the project, enabling seamless interaction with the MongoDB database. It provides a structured approach to modeling and handling data associated with books.

## View it live

The API is deployed and can be accessed at:
https://project-mongo-2ea3.onrender.com/
