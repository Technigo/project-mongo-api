// models/models.js

import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  date: String,
  title: String,
  content: String,
  author: String,
  commentsCount: Number,
  likes: Number,
  category: String,
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
