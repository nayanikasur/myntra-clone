const router = require('express').Router();
const protect = require('../middleware/auth');

router.use(protect);

const FIELDS = ['name', 'mobile', 'pincode', 'line1', 'locality', 'city', 'state', 'type'];

function clean(body) {
  const a = Object.fromEntries(FIELDS.map((k) => [k, String(body[k] || '').trim()]));
  if (!['HOME', 'WORK'].includes(a.type)) a.type = 'HOME';
  if (!a.name || !a.line1 || !a.city || !a.state) return { error: 'Please fill in all required fields' };
  if (!/^\d{10}$/.test(a.mobile)) return { error: 'Please enter a valid 10-digit mobile number' };
  if (!/^\d{6}$/.test(a.pincode)) return { error: 'Please enter a valid 6-digit pincode' };
  return { address: a };
}

function setDefault(user, id) {
  user.addresses.forEach((a) => (a.isDefault = a._id.equals(id)));
}

router.get('/', (req, res) => res.json(req.user.addresses));

router.post('/', async (req, res) => {
  const { address, error } = clean(req.body);
  if (error) return res.status(400).json({ message: error });
  req.user.addresses.push(address);
  const added = req.user.addresses[req.user.addresses.length - 1];
  if (req.body.isDefault || req.user.addresses.length === 1) setDefault(req.user, added._id);
  await req.user.save();
  res.status(201).json(req.user.addresses);
});

router.put('/:id', async (req, res) => {
  const existing = req.user.addresses.id(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Address not found' });
  const { address, error } = clean(req.body);
  if (error) return res.status(400).json({ message: error });
  existing.set(address);
  if (req.body.isDefault) setDefault(req.user, existing._id);
  await req.user.save();
  res.json(req.user.addresses);
});

router.delete('/:id', async (req, res) => {
  const existing = req.user.addresses.id(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Address not found' });
  const wasDefault = existing.isDefault;
  req.user.addresses.pull(existing._id);
  if (wasDefault && req.user.addresses.length) req.user.addresses[0].isDefault = true;
  await req.user.save();
  res.json(req.user.addresses);
});

module.exports = router;
