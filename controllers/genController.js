const Review = require('../model/genModel');
const submitReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(200).send('Review saved successfully');

  }
  catch (err) {
    res.status(500).send('Error saving review');
  }

}

module.exports = {
  submitReview,
};