const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Community = require("../models/community");
//const checkAuth = require("../middleware/check-auth");

/*const db=mongoose.connection
  db.once('open',async()=>{
    if(await Community.countDocuments().exec()>0) return

    Promise.all()
  })*/
  router.get("/",async (req,res)=>{
    //router.get("/",paginatedResults(Post),(req,res)=>{
      /*const page=req.query.page
      const limit=req.query.limit
      const start=(page-1)*limit
      const end=(page)*limit
      const result=Post.slice(start,end)
      const result = await Post.find().sort('-createdOn');*/
      //res.json(res.paginatedResults);
      Community.find()
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
      Community.findById(id)
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



router.post("/new_community",(req,res)=>{
    const community = new Community({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        subCount:0,
        desc:req.body.desc        
    });
    community
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
              message: "Community added"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
        });
});
router.post("/up",(req,res)=>{
    const result=Community.find({_id: req.body.id})
    .exec();
    if (result.length >= 1) {
        result.subCount+=1;
        result.subscribers.append(res.body.suscriber);
        return res.status(409).json({
          message: "Community exists"
        });        
    }
});
router.post("/down",(req,res)=>{
    const result=Community.find({_id: req.body.id})
    .exec();
    if (result.length >= 1) {
        result.subCount-=1;
        result.subscribers.remove(res.body.suscriber);
        return res.status(409).json({
          message: "Community exists"
        });        
    }
});
router.post("/post",(req,res)=>{
    const result=Community.find({_id: req.body.id})
    .exec();
    if (result.length >= 1) {
        result.post.append(req.body.post);
        return res.status(409).json({
          message: "Community exists"
        });        
    }
});
module.exports = router; 