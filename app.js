const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRoutes = require('./api/routes/user');
const postRoutes=require('./api/routes/post');
const communityRoutes=require('./api/routes/community');



mongoose.connect('mongodb://localhost/media',{ useNewUrlParser: true ,useUnifiedTopology:true,useCreateIndex: true})
  .then(()=>{
    console.log('Connected to mongodb');
  })
  .catch(err=>console.log('Could not connect',err.message));

//app.use(morgan("dev"));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

// Routes which should handle requests
//app.use('/uploads',express.static('uploads'));
app.use(express.json());
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/community", communityRoutes);


module.exports = app;
