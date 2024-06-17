const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  review: { type: String, required: true },
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
