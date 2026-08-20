const express = require("express");
const router = express.Router();
const {
  getPostsByTavern,
  createPost,
} = require("../controllers/postController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/tavern/:tavernId", getPostsByTavern);
router.post("/", protect, createPost);

module.exports = router;
