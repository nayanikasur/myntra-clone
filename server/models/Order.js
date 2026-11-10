const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        title: String,
        brand: String,
        thumbnail: String,
        size: String,
        qty: Number,
        price: Number,
        mrp: Number,
      },
    ],
    address: {
      name: String,
      mobile: String,
      pincode: String,
      line1: String,
      locality: String,
      city: String,
      state: String,
    },
    totalMrp: Number,
    discount: Number,
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    platformFee: Number,
    total: Number,
    paymentMethod: { type: String, default: 'COD' },
    status: { type: String, enum: ['Placed', 'Cancelled', 'Delivered'], default: 'Placed' },
    cancelledAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
