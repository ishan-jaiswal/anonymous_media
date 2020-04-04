const express = require("express");
const router = express.Router();
const UserController = require('../controller/user');
const checkAuth = require("../middleware/check-auth");

router.post("/signup", UserController.signup);

router.post("/login", UserController.login);

router.patch("/:id",checkAuth,UserController.update);

router.delete("/:userId",checkAuth,UserController.delete);

module.exports = router;