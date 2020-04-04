const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const CommunityController = require('../controller/community');
const Community = require("../models/community");

router.get("/",checkAuth,CommunityController.paginatedResults(Community),(req,res)=>{    
  res.json(res.paginatedResults);  
});

router.get("/:id",checkAuth,CommunityController.fetchspecific);

router.post("/new_community",CommunityController.newcommunity);

router.post("/up/:id",checkAuth,CommunityController.up);

router.post("/down/:id",checkAuth,CommunityController.down);

router.put("/post/:id",checkAuth,CommunityController.post);

router.delete("/:id",checkAuth, CommunityController.delete);

module.exports = router; 