const mongoose = require('mongoose');


const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
});

new PostSchema({ Title: 'The first comment', description: 'a conversation starter' , date: 2020-05-14 }) save()

module.exports = mongoose.model('posts', PostSchema);