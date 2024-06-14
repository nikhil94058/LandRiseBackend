const express = require('express');
const multer = require('multer');
const nftController = require('../controllers/nftController');
const { authenticateToken, authorizeRole } = require('../middleware/auth'); // Ensure this path is correct

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Define the route for uploading NFTs
router.post(
  '/upload',
  authenticateToken, // Authenticate first
  authorizeRole('admin'), // Then authorize
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'adharcard', maxCount: 1 },
    { name: 'passport', maxCount: 1 },
    { name: "driver's license", maxCount: 1 }
  ]),
  nftController.uploadNFT
);

// Define the route for getting NFTs
router.get(
  '/nfts',
  nftController.getNFTs
);

module.exports = router;
