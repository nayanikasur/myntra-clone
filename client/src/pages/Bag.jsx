import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../api';
import CouponModal from '../components/CouponModal';
import { BagIcon, CloseIcon } from '../components/Icons';
import PriceDetails from '../components/PriceDetails';
import { useShop } from '../context/ShopContext';

export default function Bag() {
  const { cart, updateCartItem, removeCartItem, toggleWishlist, isWishlisted, coupon, setCoupon } = useShop();
  const navigate = useNavigate();
  const [showCoupons, setShowCoupons] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <BagIcon width="96" height="96" className="empty-icon" />
        <h3>Hey, it feels so light!</h3>
        <p>There is nothing in your bag. Let's add some items.</p>
        <Link to="/wishlist" className="btn btn-outline-pink">
          ADD ITEMS FROM WISHLIST
        </Link>
      </div>
    );
  }

  const moveToWishlist = async (item) => {
    if (!isWishlisted(item.product._id)) await toggleWishlist(item.product._id);
    await removeCartItem(item._id);
  };

  return (
    <div className="checkout-layout">
      <section className="checkout-left">
        <div className="offer-box">
          <h4>Available Offers</h4>
          <p>10% Instant Discount on select bank cards on a minimum spend of ₹3,500. TCA</p>
        </div>
        <h3 className="bag-count">
          {cart.length} ITEM{cart.length === 1 ? '' : 'S'} IN BAG
        </h3>
        <ul className="bag-items">
          {cart.map((item) => {
            const p = item.product;
            return (
              <li key={item._id} className="bag-item">
                <Link to={`/product/${p._id}`}>
                  <img src={p.thumbnail} alt={p.title} />
                </Link>
                <div className="bag-item-info">
                  <h4>{p.brand}</h4>
                  <p>{p.title}</p>
                  <div className="bag-selects">
                    <label>
                      Size:
                      <select value={item.size} onChange={(e) => updateCartItem(item._id, { size: e.target.value })}>
                        {p.sizes.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Qty:
                      <select value={item.qty} onChange={(e) => updateCartItem(item._id, { qty: Number(e.target.value) })}>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n}>{n}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="bag-price">
                    <strong>{formatPrice(p.price * item.qty)}</strong>
                    {p.discount > 0 && (
                      <>
                        <s>{formatPrice(p.mrp * item.qty)}</s>
                        <span className="off">{p.discount}% OFF</span>
                      </>
                    )}
                  </div>
                  <p className="return-note">14 days return available</p>
                  <button type="button" className="link-btn" onClick={() => moveToWishlist(item)}>
                    MOVE TO WISHLIST
                  </button>
                </div>
                <button type="button" className="bag-remove" aria-label="Remove" onClick={() => removeCartItem(item._id)}>
                  <CloseIcon />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="checkout-right">
        <div className="coupon-box">
          <h4>COUPONS</h4>
          <div className="coupon-row">
            <span className="tag-icon">%</span>
            {coupon ? (
              <div className="coupon-applied">
                <strong>1 Coupon applied</strong>
                <span className="green">You saved additional {formatPrice(coupon.discount)}</span>
              </div>
            ) : (
              <strong>Apply Coupons</strong>
            )}
            <button type="button" className="btn btn-outline-pink btn-sm" onClick={() => setShowCoupons(true)}>
              {coupon ? 'EDIT' : 'APPLY'}
            </button>
          </div>
          {coupon && (
            <button type="button" className="link-btn remove-coupon" onClick={() => setCoupon(null)}>
              Remove {coupon.code}
            </button>
          )}
        </div>
        {showCoupons && <CouponModal onClose={() => setShowCoupons(false)} />}
        <PriceDetails cart={cart} coupon={coupon}>
          <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/checkout/address')}>
            PLACE ORDER
          </button>
        </PriceDetails>
      </aside>
    </div>
  );
}
