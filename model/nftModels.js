const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  ownerName: String,
  address: String,
  price: String,
  image: String,
  documents: [String],
  tokenURI: String,
  listingType: String,
});

const NFT = mongoose.model('NFT', nftSchema);

module.exports = NFT;
