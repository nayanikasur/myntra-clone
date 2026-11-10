const router = require('express').Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const protect = require('../middleware/auth');
const coupons = require('../config/coupons');

router.use(protect);

const PLATFORM_FEE = 20;
const PAYMENT_METHODS = ['COD'];

const findOwn = (req) =>
  mongoose.isValidObjectId(req.params.id) ? Order.findOne({ _id: req.params.id, user: req.user._id }) : null;

router.get('/', async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
});

router.get('/:id', async (req, res) => {
  const order = await findOwn(req);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// POST /api/orders { addressId, couponCode?, paymentMethod }
router.post('/', async (req, res) => {
  const { addressId, couponCode, paymentMethod = 'COD' } = req.body;
  if (!PAYMENT_METHODS.includes(paymentMethod))
    return res.status(400).json({ message: 'This payment method is not available' });
  const saved = mongoose.isValidObjectId(addressId) && req.user.addresses.id(addressId);
  if (!saved) return res.status(400).json({ message: 'Please select a delivery address' });

  await req.user.populate('cart.product');
  const cart = req.user.cart.filter((i) => i.product);
  if (!cart.length) return res.status(400).json({ message: 'Your bag is empty' });

  // prices always come from the database, never from the client
  const items = cart.map((i) => ({
    product: i.product._id,
    title: i.product.title,
    brand: i.product.brand,
    thumbnail: i.product.thumbnail,
    size: i.size,
    qty: i.qty,
    price: i.product.price,
    mrp: i.product.mrp,
  }));
  const totalMrp = items.reduce((s, i) => s + i.mrp * i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  let couponDiscount = 0;
  let appliedCoupon = '';
  if (couponCode) {
    const orderCount = await Order.countDocuments({ user: req.user._id });
    const r = coupons.apply(couponCode, subtotal, orderCount);
    if (!r.ok) return res.status(400).json({ message: `Coupon ${couponCode}: ${r.reason}` });
    couponDiscount = r.discount;
    appliedCoupon = r.code;
  }

  const { name, mobile, pincode, line1, locality, city, state } = saved;
  const order = await Order.create({
    user: req.user._id,
    items,
    address: { name, mobile, pincode, line1, locality, city, state },
    totalMrp,
    discount: totalMrp - subtotal,
    couponCode: appliedCoupon,
    couponDiscount,
    platformFee: PLATFORM_FEE,
    total: subtotal - couponDiscount + PLATFORM_FEE,
    paymentMethod,
  });

  req.user.cart = [];
  await req.user.save();
  res.status(201).json(order);
});

router.patch('/:id/cancel', async (req, res) => {
  const order = await findOwn(req);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status !== 'Placed') return res.status(400).json({ message: `Order is already ${order.status.toLowerCase()}` });
  order.status = 'Cancelled';
  order.cancelledAt = new Date();
  await order.save();
  res.json(order);
});

module.exports = router;
