const mongoose = require('mongoose');

const communitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
     name: String,
     mods: [Number],
     subCount: Number,
     subscribers: [String],
     posts: [String],
     desc: String,
     rules: [String],
     createdOn: Number
});

module.exports = mongoose.model('Community', communitySchema);
