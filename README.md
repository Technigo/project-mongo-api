# Custom Netflix API (Part 2)

### Summary

A custom API created with Express and MongoDB to provide information about movies and TV shows on Netflix.

### Implementation details

In this project I have implemented relevant API routes in Express to handle Netflix show requests. In [the first version of the Custom Netflix API](https://github.com/codebyfredrik/project-express-api) a JSON dataset was used to simulate the database. In this version a MongoDB database is used to store information about movies and TV shows on Netflix.

Mongoose, an Object Data Modeling (ODM) library for MongoDB and Node JS, is used in this project to manage relationships between data, provide schema validation, and translate between objects in code and the representation of those objects in MongoDB.

To combat invalid data in incoming API requests I decided to implement the Joi library, a powerful schema description language and data validator for JavaScript. Together with the middleware library Celebrate, which is an Express wrapper for the Joi library, Express can intercept and validate incoming requests objects before they even reach the route handler. The benefit of using a middleware is that the pure logic for validation is centralized, thus keeping the error handling logic in the route handlers to a minimum.

### Technologies used

- JavaScript ES6+
- Node.js
- [Express](https://expressjs.com/) - A minimal and flexible Node JS web application framework
- [MongoDB](https://www.mongodb.com/) - A general purpose, document-based, distributed database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node JS
- [Joi](https://hapi.dev/family/joi/) - A powerful schema description language and data validator
- [Celebrate](https://github.com/arb/celebrate) - A Joi validation middleware for Express JS

### Where can you see it in action?

- URL to custom Netflix API documentation: https://express-mongodb-netflix-api.herokuapp.com/
- URL to a site using the API: https://vigorous-euler-6beb1a.netlify.com/
