const mongoose = require("mongoose");
const Community = require("../models/community");

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
};

exports.newcommunity = (req,res)=>{
    const community = new Community({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        subCount:0,
        desc:req.body.desc,
        mods:req.body.mods,
        rules: req.body.rules        
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
};

exports.up = async(req,res)=>{
    const id = req.params.id;
    const result=await Community.findById(id);
    const flag=await Community.findByIdAndUpdate(id,
      {       
        subCount : result.subCount+1,
        subscribers:result.subscribers.append(req.body.id)     
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

exports.down = async(req,res)=>{
    const id = req.params.id;
    const result=await Community.findById(id);
    const flag=await Community.findByIdAndUpdate(id,
      {       
        subCount : result.subCount-1,
        subscribers:result.subscribers.remove(req.body.id)     
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

exports.post = async(req,res)=>{
    const id = req.params.id;
    const result=await Community.findById(id);
    const flag=await Community.findByIdAndUpdate(id,
      {             
        post:result.post.append(req.body.post)     
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

exports.delete = (req, res) => {
    const id = req.params.id;
    Community.remove({ _id: id })
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