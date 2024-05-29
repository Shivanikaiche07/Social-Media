const express = require("express");
const {createPost ,PostlikeAndUnlike, DeletePost, getPostOfFollowing, updateCaption } = require("../controllers/post");
const {isAuthenticated} = require("../wares/authentication");

const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);

router.route("/post/:id")
.get(isAuthenticated, PostlikeAndUnlike)
.put(isAuthenticated, updateCaption)
.delete(isAuthenticated, DeletePost);

router.route("/posts").get(isAuthenticated, getPostOfFollowing);



module.exports = router;