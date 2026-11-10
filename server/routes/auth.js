const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/auth');

const sign = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email, mobile: u.mobile, gender: u.gender, createdAt: u.createdAt });

router.post('/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(409).json({ message: 'An account with this email already exists' });
  const user = await User.create({ name, email, mobile, password });
  res.status(201).json({ token: sign(user), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() });
  if (!user || !(await user.matchPassword(String(password || ''))))
    return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: sign(user), user: publicUser(user) });
});

router.get('/me', protect, (req, res) => res.json(publicUser(req.user)));

router.put('/me', protect, async (req, res) => {
  const { name, mobile, gender } = req.body;
  if (name !== undefined) {
    if (!String(name).trim()) return res.status(400).json({ message: 'Name cannot be empty' });
    req.user.name = String(name).trim();
  }
  if (mobile !== undefined) {
    if (mobile && !/^\d{10}$/.test(String(mobile))) return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' });
    req.user.mobile = String(mobile);
  }
  if (gender !== undefined && ['', 'Male', 'Female'].includes(gender)) req.user.gender = gender;
  await req.user.save();
  res.json(publicUser(req.user));
});

router.put('/password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!(await req.user.matchPassword(String(currentPassword || ''))))
    return res.status(400).json({ message: 'Current password is incorrect' });
  if (String(newPassword || '').length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });
  req.user.password = String(newPassword);
  await req.user.save();
  res.json({ message: 'Password updated' });
});

module.exports = router;
