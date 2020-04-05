const mongoose = require("mongoose");
const Post = require("../models/post");

exports.paginatedResults=(model)=>{
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
};

exports.fetchspecific = (req,res)=>{
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
};

exports.newpost=(req,res)=>{    
    const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        title:req.body.title,
        community:req.body.community,
        content:req.body.content,
        upCount:0,
        downCount:0,
        comments:0,
        postImage:req.file.path
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
};

exports.up = async(req,res)=>{
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
};

exports.down=async(req,res)=>{
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
};

exports.comment = async(req,res)=>{
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
};

exports.delete= (req, res) => {
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
};