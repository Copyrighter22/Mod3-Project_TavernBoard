const express = require("express");
const router = express.Router();
const {
  getTaverns,
  getTavernById,
  createTavern,
  toggleJoinTavern,
} = require("../controllers/tavernController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploader");

const tavernUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

router.get("/", getTaverns);
router.get("/:id", getTavernById);
router.post("/", protect, tavernUpload, createTavern);
router.put("/:id/join", protect, toggleJoinTavern);

module.exports = router;
