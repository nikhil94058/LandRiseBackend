const NFT = require('../model/nftModels');
const pinFileToIPFS = require('../services/pinataServices');
const fs = require('fs');

exports.uploadNFT = async (req, res) => {
  try {
    const { ownerName, address, price, listingType } = req.body;

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
      listingType,
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
};

exports.getNFTs = async (req, res) => {
  try {
    const nfts = await NFT.find();
    res.json({ nfts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
