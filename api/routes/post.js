const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer=require('multer');
const Post = require("../models/post");
//const checkAuth = require("../middleware/check-auth");

const storage=multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./uploads/');
  },
  filename: function(req,file,cb){
    cb(nukll,new Date().toISOString()+ file.originalname);
  }
});
const upload=multer({storage:storage,limits:{
  fileSize:1024*1024*5 //5mb
}}); 
/*const db=mongoose.connection
  db.once('open',async()=>{
    if(await Post.countDocuments().exec()>0) return

    Promise.all()
  })*/
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

router.get("/",async (req,res)=>{
//router.get("/",paginatedResults(Post),(req,res)=>{
  /*const page=req.query.page
  const limit=req.query.limit
  const start=(page-1)*limit
  const end=(page)*limit
  const result=Post.slice(start,end)
  const result = await Post.find().sort('-createdOn');*/
  //res.json(res.paginatedResults);
  Post.find()
    .exec()
    .then(docs => {
      console.log(docs);
      //   if (docs.length >= 0) {
      res.status(200).json(docs);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
router.get("/:id",(req,res)=>{
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
  //console.log(req.file);
  
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
router.put("/upcount/:id",(req,res)=>{
  const id = req.params.id;
  const result=Post.findByIdAndUpdate(id,{
    upCount:1//update problem
  });
});
router.put("/downcount",(req,res)=>{
  const id = req.params.id;
  const result=Post.findByIdAndUpdate(id,{
    downCount:1//update problem
  });
});
router.put("/comment",(req,res)=>{
  const id = req.params.id;
  const result=Post.findByIdAndUpdate(id,{
    comments:1//update problem
  });
});
module.exports = router; 