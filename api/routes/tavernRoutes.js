const express = require("express");
const router = express.Router();
const {
  getTaverns,
  getTavernById,
  createTavern,
  toggleJoinTavern,
} = require("../controllers/tavernController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", getTaverns);
router.get("/:id", getTavernById);
router.post("/", protect, createTavern);
router.put("/:id/join", protect, toggleJoinTavern);

module.exports = router;
