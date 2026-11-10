const router = require('express').Router();
const Order = require('../models/Order');
const protect = require('../middleware/auth');
const coupons = require('../config/coupons');

router.use(protect);

const bagAmount = async (user) => {
  await user.populate('cart.product', 'price');
  return user.cart.filter((i) => i.product).reduce((s, i) => s + i.product.price * i.qty, 0);
};

// GET /api/coupons -> every coupon, flagged as applicable or not for the current bag
router.get('/', async (req, res) => {
  const [amount, orderCount] = await Promise.all([bagAmount(req.user), Order.countDocuments({ user: req.user._id })]);
  res.json(coupons.listFor(amount, orderCount));
});

// POST /api/coupons/apply { code } -> { code, discount } for the current bag
router.post('/apply', async (req, res) => {
  const [amount, orderCount] = await Promise.all([bagAmount(req.user), Order.countDocuments({ user: req.user._id })]);
  const r = coupons.apply(req.body.code, amount, orderCount);
  if (!r.ok) return res.status(400).json({ message: r.reason });
  res.json({ code: r.code, discount: r.discount });
});

module.exports = router;
