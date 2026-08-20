const express = require("express");
const router = express.Router();

const { getTaverns, createTavern } = require("../controllers/tavernController");

const { protect } = require("../middlewares/authMiddleware");

router.route("/").get(getTaverns).post(protect, createTavern);

module.exports = router;
