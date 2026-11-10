import { formatPrice } from '../api';

export const PLATFORM_FEE = 20;

export function cartTotals(cart, couponDiscount = 0) {
  const totalMrp = cart.reduce((s, i) => s + i.product.mrp * i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  return { totalMrp, discount: totalMrp - subtotal, total: subtotal - couponDiscount + PLATFORM_FEE };
}

export default function PriceDetails({ cart, coupon, children }) {
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const couponDiscount = coupon?.discount || 0;
  const { totalMrp, discount, total } = cartTotals(cart, couponDiscount);
  return (
    <div className="price-details">
      <h4>
        PRICE DETAILS ({count} Item{count === 1 ? '' : 's'})
      </h4>
      <div className="pd-row">
        <span>Total MRP</span>
        <span>{formatPrice(totalMrp)}</span>
      </div>
      <div className="pd-row">
        <span>Discount on MRP</span>
        <span className="green">-{formatPrice(discount)}</span>
      </div>
      <div className="pd-row">
        <span>Coupon Discount</span>
        {couponDiscount ? <span className="green">-{formatPrice(couponDiscount)}</span> : <span className="pink">Apply Coupon</span>}
      </div>
      <div className="pd-row">
        <span>Platform Fee</span>
        <span>{formatPrice(PLATFORM_FEE)}</span>
      </div>
      <div className="pd-row">
        <span>Shipping Fee</span>
        <span className="green">FREE</span>
      </div>
      <div className="pd-row pd-total">
        <span>Total Amount</span>
        <span>{formatPrice(total)}</span>
      </div>
      {children}
    </div>
  );
}
