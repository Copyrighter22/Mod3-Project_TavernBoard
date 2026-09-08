const express = require("express");
const router = express.Router();
const { searchAll } = require("../controllers/searchController");

// -----------------------------------------------------------------------------
// @desc    Búsqueda global simultánea en tabernas, usuarios y publicaciones
// @route   GET /api/search?q=query
// @access  Público
// -----------------------------------------------------------------------------
router.get("/", searchAll);

module.exports = router;
