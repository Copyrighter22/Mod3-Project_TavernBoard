const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/post/:postId", getCommentsByPost);
router.post("/post/:postId", protect, createComment);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
