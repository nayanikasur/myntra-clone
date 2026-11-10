const router = require('express').Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const list = (v) => (v ? String(v).split(',').filter(Boolean) : []);
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTS = {
  recommended: { ratingCount: -1 },
  new: { createdAt: -1 },
  popularity: { rating: -1 },
  discount: { discount: -1 },
  price_desc: { price: -1 },
  price_asc: { price: 1 },
  rating: { rating: -1 },
};

const facet = (match, field) =>
  Product.aggregate([{ $match: match }, { $group: { _id: `$${field}`, count: { $sum: 1 } } }, { $sort: { count: -1 } }]);

// GET /api/products?gender=men&category=Shirts,Watches&brand=..&price=0-999,1000-1999&discount=40&q=..&sort=..&page=1
router.get('/', async (req, res) => {
  const { gender, q, discount, sort = 'recommended', page = 1, limit = 50 } = req.query;
  const base = {};
  if (gender) base.gender = String(gender);
  if (q) {
    const rx = new RegExp(escapeRegex(String(q)), 'i');
    base.$or = [{ title: rx }, { brand: rx }, { category: rx }, { gender: rx }];
  }

  const filter = { ...base };
  const categories = list(req.query.category);
  const brands = list(req.query.brand);
  const colors = list(req.query.color);
  const prices = list(req.query.price);
  if (categories.length) filter.category = { $in: categories };
  if (brands.length) filter.brand = { $in: brands };
  if (colors.length) filter.color = { $in: colors };
  if (prices.length) {
    const ranges = prices.map((r) => {
      const [min, max] = r.split('-').map(Number);
      return { price: { $gte: min || 0, ...(max ? { $lte: max } : {}) } };
    });
    filter.$and = [{ $or: ranges }];
  }
  if (discount) filter.discount = { $gte: Number(discount) };

  const pageNum = Math.max(1, Number(page) || 1);
  const lim = Math.min(100, Number(limit) || 50);
  // facets use the base query so filter options don't disappear once one is selected
  const [products, total, cats, brandFacets, colorFacets] = await Promise.all([
    Product.find(filter)
      .sort(SORTS[sort] || SORTS.recommended)
      .skip((pageNum - 1) * lim)
      .limit(lim)
      .select('-description'),
    Product.countDocuments(filter),
    facet(base, 'category'),
    facet(base, 'brand'),
    facet(base, 'color'),
  ]);

  const toFacet = (arr) => arr.map((f) => ({ name: f._id, count: f.count }));
  res.json({
    products,
    total,
    page: pageNum,
    pages: Math.ceil(total / lim),
    facets: { categories: toFacet(cats), brands: toFacet(brandFacets), colors: toFacet(colorFacets) },
  });
});

// GET /api/products/suggest?q=wat -> brand, category and product suggestions for the search box
router.get('/suggest', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json([]);
  const rx = new RegExp(escapeRegex(q), 'i');
  const [brands, categories, products] = await Promise.all([
    Product.distinct('brand', { brand: rx }),
    Product.aggregate([{ $match: { category: rx } }, { $group: { _id: { category: '$category', gender: '$gender' } } }, { $limit: 4 }]),
    Product.find({ title: rx }).limit(5).select('title brand'),
  ]);
  res.json([
    ...categories.map((c) => ({ type: 'category', label: `${c._id.category}`, sub: c._id.gender, url: `/shop/${c._id.gender}?category=${encodeURIComponent(c._id.category)}` })),
    ...brands.slice(0, 4).map((b) => ({ type: 'brand', label: b, sub: 'Brand', url: `/search?q=${encodeURIComponent(b)}` })),
    ...products.map((p) => ({ type: 'product', label: p.title, sub: p.brand, url: `/product/${p._id}` })),
  ]);
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Product not found' });
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const similar = await Product.find({ category: product.category, _id: { $ne: product._id } })
    .limit(10)
    .select('-description');
  res.json({ product, similar });
});

module.exports = router;
