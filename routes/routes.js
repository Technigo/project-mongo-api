// routes/routes.js

import express from 'express';
import BlogPost from '../models/models.js'; // Adjust the path as necessary

const router = express.Router();

// Root endpoint - Documentation
router.get('/', (req, res) => {
  // Implement documentation here, e.g., using express-list-endpoints if you want to automate it
  res.json({ message: 'API Documentation' });
});

// Return a collection of blog posts
router.get('/blogposts', async (req, res) => {
  const blogPosts = await BlogPost.find();
  res.json(blogPosts);
});

// Return a single blog post
router.get('/blogposts/:id', async (req, res) => {
  const blogPost = await BlogPost.findById(req.params.id);
  if (blogPost) {
    res.json(blogPost);
  } else {
    res.status(404).send({ error: 'Blog post not found' });
  }
});

export default router;
