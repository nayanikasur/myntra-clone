const router = require('express').Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const protect = require('../middleware/auth');

router.use(protect);

const populated = async (user) => {
  await user.populate('cart.product', '-description');
  // drop items whose product no longer exists
  return user.cart.filter((i) => i.product);
};

router.get('/', async (req, res) => res.json(await populated(req.user)));

router.post('/', async (req, res) => {
  const { productId, size } = req.body;
  const qty = Math.max(1, Number(req.body.qty) || 1);
  if (!mongoose.isValidObjectId(productId) || !(await Product.exists({ _id: productId })))
    return res.status(404).json({ message: 'Product not found' });
  if (!size) return res.status(400).json({ message: 'Please select a size' });
  const existing = req.user.cart.find((i) => i.product.equals(productId) && i.size === size);
  if (existing) existing.qty = Math.min(10, existing.qty + qty);
  else req.user.cart.push({ product: productId, size, qty: Math.min(10, qty) });
  await req.user.save();
  res.json(await populated(req.user));
});

router.patch('/:itemId', async (req, res) => {
  const item = req.user.cart.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Item not in bag' });
  if (req.body.qty) item.qty = Math.min(10, Math.max(1, Number(req.body.qty) || 1));
  if (req.body.size) item.size = String(req.body.size);
  await req.user.save();
  res.json(await populated(req.user));
});

router.delete('/:itemId', async (req, res) => {
  req.user.cart.pull(req.params.itemId);
  await req.user.save();
  res.json(await populated(req.user));
});

module.exports = router;
