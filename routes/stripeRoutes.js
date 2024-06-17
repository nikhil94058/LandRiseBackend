const stripe = require('stripe')('sk_test_51PSDW606LRj8AHh0YatF1v1GSDtbcT6PgXhGQA3tOhkwN5D014UfOsWcnID3GkiZgVdXQk78AoHF99VQWYsfegya00TEazS2Ou');
const express = require('express');

const router = express.Router();

router.post("/payments", (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);
  console.log("PIRCE", product.price);

})