import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, formatPrice } from '../api';
import PriceDetails, { cartTotals } from '../components/PriceDetails';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';

// Only Cash on Delivery actually works; the rest are shown for layout and are disabled.
const METHODS = [
  ['COD', 'Cash On Delivery (Cash/UPI)'],
  ['UPI', 'UPI (Pay via any App)'],
  ['CARD', 'Credit/Debit Card'],
  ['WALLET', 'Wallets'],
  ['NETBANKING', 'Net Banking'],
  ['EMI', 'EMI / Pay Later'],
];

export default function Payment() {
  const { cart, setCart, coupon, setCoupon, addressId } = useShop();
  const toast = useToast();
  const navigate = useNavigate();
  const [method, setMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);

  if (!placing && cart.length === 0) return <Navigate to="/checkout/cart" replace />;
  if (!placing && !addressId) return <Navigate to="/checkout/address" replace />;

  const { total } = cartTotals(cart, coupon?.discount || 0);

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const order = await api('/orders', {
        method: 'POST',
        body: { addressId, couponCode: coupon?.code, paymentMethod: 'COD' },
      });
      setCart([]);
      setCoupon(null);
      navigate(`/checkout/success/${order._id}`, { replace: true });
    } catch (err) {
      toast(err.message, 'error');
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-layout">
      <section className="checkout-left">
        <div className="offer-box">
          <h4>Bank Offer</h4>
          <p>10% Instant Discount on select credit cards on a minimum spend of ₹3,500 (not available in this demo).</p>
        </div>
        <h3 className="bag-count">Choose Payment Mode</h3>
        <div className="pay-modes">
          <ul className="pay-tabs">
            {METHODS.map(([key, label]) => (
              <li key={key}>
                <button type="button" className={method === key ? 'active' : ''} onClick={() => setMethod(key)}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <div className="pay-panel">
            {method === 'COD' ? (
              <>
                <label className="pay-option">
                  <input type="radio" checked readOnly /> Pay on delivery (Cash/UPI)
                </label>
                <p className="muted">You can pay via Cash or UPI enabled app at the time of delivery.</p>
                <button type="button" className="btn btn-primary btn-block" onClick={placeOrder} disabled={placing}>
                  {placing ? 'PLACING ORDER…' : `PLACE ORDER · ${formatPrice(total)}`}
                </button>
              </>
            ) : (
              <div className="pay-unavailable">
                <strong>{METHODS.find(([k]) => k === method)[1]}</strong>
                <p>This payment mode isn't available in this demo store. Please choose Cash On Delivery.</p>
                <button type="button" className="btn btn-outline-pink" onClick={() => setMethod('COD')}>
                  USE CASH ON DELIVERY
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <aside className="checkout-right">
        <PriceDetails cart={cart} coupon={coupon} />
      </aside>
    </div>
  );
}
