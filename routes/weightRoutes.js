const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const {createWeight, getWeights, getWeightByDate, deleteWeight } = require("../controllers/weightController")


router.post("/", protect, createWeight);
router.get("/", protect, getWeights);
router.get("/:date", protect, getWeightByDate);
router.delete("/", protect, deleteWeight);

module.exports = router;