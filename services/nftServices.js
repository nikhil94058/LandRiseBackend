require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const NFT = require('../model/nftModels');

const buyNft = async (nftId, paymentMethodId, newOwnerName, newOwnerAddress) => {
  try {
    const nft = await NFT.findById(nftId);
    if (!nft) {
      throw new Error('NFT not found');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(nft.price) * 100, // Stripe amount is in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    nft.ownerName = newOwnerName;
    nft.address = newOwnerAddress;
    await nft.save();

    return { success: true, nft };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { buyNft };
