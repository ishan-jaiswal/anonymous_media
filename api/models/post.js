const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    community: String,
    contentType: Number,
    content: String,
    createdOn: Date,
    upCount : Number,
    downCount : Number,
    upVotedBy: [String],
    comments: Number,
    postImage: String
});

module.exports = mongoose.model('Post', postSchema);
