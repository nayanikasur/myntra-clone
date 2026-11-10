// Coupon rules live only on the server; the client asks the API what a coupon is worth.
const COUPONS = [
  {
    code: 'NEW300',
    title: 'Flat ₹300 off on your first order',
    minAmount: 999,
    firstOrderOnly: true,
    calc: () => 300,
  },
  {
    code: 'SAVE10',
    title: '10% off up to ₹500',
    minAmount: 1999,
    calc: (amount) => Math.min(500, Math.round(amount * 0.1)),
  },
  {
    code: 'STYLE200',
    title: 'Flat ₹200 off',
    minAmount: 1499,
    calc: () => 200,
  },
  {
    code: 'BIGBAG15',
    title: '15% off up to ₹1500 on big bags',
    minAmount: 9999,
    calc: (amount) => Math.min(1500, Math.round(amount * 0.15)),
  },
];

// amount = bag total after product discounts; orderCount = user's previous orders
function evaluate(coupon, amount, orderCount) {
  if (coupon.firstOrderOnly && orderCount > 0) return { ok: false, reason: 'Valid only on your first order' };
  if (amount < coupon.minAmount)
    return { ok: false, reason: `Add items worth ₹${coupon.minAmount - amount} more to apply` };
  return { ok: true, discount: coupon.calc(amount) };
}

function listFor(amount, orderCount) {
  return COUPONS.map((c) => {
    const r = evaluate(c, amount, orderCount);
    return { code: c.code, title: c.title, minAmount: c.minAmount, applicable: r.ok, discount: r.discount || 0, reason: r.reason || '' };
  });
}

function apply(code, amount, orderCount) {
  const coupon = COUPONS.find((c) => c.code === String(code || '').toUpperCase().trim());
  if (!coupon) return { ok: false, reason: 'Invalid coupon code' };
  return { ...evaluate(coupon, amount, orderCount), code: coupon.code };
}

module.exports = { listFor, apply };
