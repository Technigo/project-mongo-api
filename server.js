// server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import blogData from './data/blogposts.json' assert { type: 'json' };
import blogRoutes from './routes/routes.js'; // Adjust the path as necessary
import BlogPost from './models/models.js'; // Adjust the path as necessary

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

if (process.env.RESET_DB === 'true') {
  const seedDatabase = async () => {
    await BlogPost.deleteMany({});
    await BlogPost.insertMany(blogData);
    console.log('Database seeded');
  };
  seedDatabase();
}

app.use(express.json());
app.use('/', blogRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
