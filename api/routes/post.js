const express = require("express");
const router = express.Router();
const PostController = require('../controller/post');
const checkAuth = require("../middleware/check-auth");
const Post = require("../models/post");
//const multer=require('multer');

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

router.get("/",checkAuth,PostController.paginatedResults(Post),(req,res)=>{
  res.json(res.paginatedResults);
});

router.get("/:id",checkAuth,PostController.fetchspecific);

//router.post("/new_post",upload.single('postImage'),PostController.newpost);
router.post("/new_post",PostController.newpost);

router.put("/up/:id",checkAuth,);

router.put("/down/:id",checkAuth,PostController.down);

router.put("/comment/:id",checkAuth,PostController.comment);

router.delete("/:id",checkAuth, PostController.delete);

module.exports = router; 