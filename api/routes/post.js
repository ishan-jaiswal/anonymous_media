const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
//const multer=require('multer');
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

/*const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString());
  }
});

const upload=multer({storage:storage,
  limits:{
   fileSize:1024*1024*5 }//5mb upload limit
  }); */



function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec()
      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}

router.get("/",checkAuth,paginatedResults(Post),(req,res)=>{
  res.json(res.paginatedResults);
});
router.get("/:id",checkAuth,(req,res)=>{
  const id = req.params.id;
  Post.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


router.post("/new_post",(req,res)=>{
//router.post("/new_post",upload.single('postImage'),(req,res)=>{ 
  
    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        title:req.body.title,
        community:req.body.community,
        content:req.body.content,
        upCount:0,
        downCount:0,
        comments:0
        //postImage:req.file.path
    });
    post
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
              message: "Post added"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
        });
});

router.put("/up/:id",checkAuth,async(req,res)=>{
  const id = req.params.id;
  const result=await Post.findById(id);
  const flag=await Post.findByIdAndUpdate(id,
    {       
      upCount : result.upCount+1,     
    });
    if(flag)
    {
      res.status(200).send("Updated");
    }
    else
    {
      return res.status(404).send("Error not found");
    }  
});

router.put("/down/:id",checkAuth,async(req,res)=>{
  const id = req.params.id;
  const result=await Post.findById(id);
  const flag=await Post.findByIdAndUpdate(id,
    {       
      downCount : result.downCount+1,     
    });
    if(flag)
    {
      res.status(200).send("Updated");
    }
    else
    {
      return res.status(404).send("Error not found");
    }  
});

router.put("/comment/:id",checkAuth,async(req,res)=>{
  const id = req.params.id;
  const result=await Post.findById(id);
  const flag=await Post.findByIdAndUpdate(id,
    {       
      comments : result.comments+1,     
    });
    if(flag)
    {
      res.status(200).send("Updated");
    }
    else
    {
      return res.status(404).send("Error not found");
    }  
});

router.delete("/:id",checkAuth, (req, res) => {
  const id = req.params.id;
  Post.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router; 
