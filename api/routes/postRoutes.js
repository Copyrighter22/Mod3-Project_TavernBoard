const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPostsByTavern,
  createPost,
  toggleLikePost,
  deletePost,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getPosts);
router.get("/tavern/:tavernId", getPostsByTavern);
router.post("/", protect, createPost);
router.put("/:id/like", protect, toggleLikePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
