const router = require('express').Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const protect = require('../middleware/auth');

router.use(protect);

const populated = async (user) => {
  await user.populate('wishlist', '-description');
  return user.wishlist.filter(Boolean);
};

router.get('/', async (req, res) => res.json(await populated(req.user)));

router.post('/:productId', async (req, res) => {
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId) || !(await Product.exists({ _id: productId })))
    return res.status(404).json({ message: 'Product not found' });
  req.user.wishlist.addToSet(productId);
  await req.user.save();
  res.json(await populated(req.user));
});

router.delete('/:productId', async (req, res) => {
  req.user.wishlist.pull(req.params.productId);
  await req.user.save();
  res.json(await populated(req.user));
});

module.exports = router;
