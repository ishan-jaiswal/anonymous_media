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