const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/genController');

router.post('/feedback/upload', reviewController.submitReview);
module.exports = router;