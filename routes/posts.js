import express from 'express';
const router = express.Router();
const Post = ('/database/models/Post').Post;


//get all the posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    }catch (err) {
res.json({ message: 'err' });
    }
});

//Submits posts
router.post('/', async (req, res) => {
  
  const post = new post({
      title: req.body.title,
      description: req.body.description
  });

try {
 const savedPost = await post.save();
res.json(savedPost);
}catch(err) {
    res.json({message: 'err'});
}
});

//Find a specifiic post
router.get('/:postId', async (req,res) => {
    try{ 
    const post = await Post.findById(req.params.postId);
    res.json(post);
    }catch (err) {
        res.json({ message: 'err'});
    }
})

// Delete a post
router.delete('/:postId', async (req,res) => {
   try{
    const removedPost = await Post.remove({_id: req.params.postId})
    res.json(removedPost);
   }catch (err) {
    res.json({ message: 'err'});
}
});


module.exports = router;