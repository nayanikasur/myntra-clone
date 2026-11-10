const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    brand: { type: String, required: true, index: true },
    gender: { type: String, enum: ['men', 'women', 'kids', 'beauty', 'home'], index: true },
    category: { type: String, index: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    rating: Number,
    ratingCount: Number,
    sizes: [String],
    color: String,
    images: [String],
    thumbnail: String,
    stock: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
