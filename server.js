const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors package

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

// Enable CORS
app.use(cors()); // Use the cors middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

const nftSchema = new mongoose.Schema({
  ownerName: String,
  address: String,
  price: String,
  image: String,
  documents: [String],
  tokenURI: String,
  listingType: String, // Add the listingType field
});

const NFT = mongoose.model('NFT', nftSchema);

const pinFileToIPFS = async (filePath, fileName) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath), { filename: fileName });

  try {
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    return response.data.IpfsHash;
  } catch (error) {
    throw new Error('Failed to pin file to IPFS');
  }
};

app.post('/api/upload', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'adharcard', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
  { name: "driver's license", maxCount: 1 },
]), async (req, res) => {
  try {
    const { ownerName, address, price, listingType } = req.body; // Include listingType

    const image = req.files['image'][0];
    const adharcard = req.files['adharcard'] ? req.files['adharcard'][0] : null;
    const passport = req.files['passport'] ? req.files['passport'][0] : null;
    const driversLicense = req.files["driver's license"] ? req.files["driver's license"][0] : null;

    const imageHash = await pinFileToIPFS(image.path, image.originalname);
    const adharcardHash = adharcard ? await pinFileToIPFS(adharcard.path, adharcard.originalname) : null;
    const passportHash = passport ? await pinFileToIPFS(passport.path, passport.originalname) : null;
    const driversLicenseHash = driversLicense ? await pinFileToIPFS(driversLicense.path, driversLicense.originalname) : null;

    const nftData = {
      ownerName,
      address,
      price,
      listingType, // Include listingType in the NFT data
      image: imageHash,
      documents: [adharcardHash, passportHash, driversLicenseHash].filter(Boolean),
      tokenURI: `ipfs://${imageHash}`,
    };

    const nft = new NFT(nftData);
    await nft.save();

    res.json({ ipfsHash: nftData.tokenURI });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    Object.values(req.files).flat().forEach(file => fs.unlinkSync(file.path));
  }
});

app.get('/api/nfts', async (req, res) => {
  try {
    const nfts = await NFT.find();
    res.json({ nfts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
