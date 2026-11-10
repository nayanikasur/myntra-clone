import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatPrice } from '../../api';
import { useToast } from '../../context/ToastContext';
import { fmtDate } from './Orders';

export default function OrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    api(`/orders/${id}`).then(setOrder).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="error-text">{error}</p>;
  if (!order) return <div className="page-loader" />;

  const cancel = async () => {
    try {
      setOrder(await api(`/orders/${id}/cancel`, { method: 'PATCH' }));
      toast('Your order has been cancelled', 'success');
    } catch (e) {
      toast(e.message, 'error');
    }
    setConfirming(false);
  };

  const a = order.address;
  const steps = order.status === 'Cancelled' ? ['Ordered', 'Cancelled'] : ['Ordered', 'Shipped', 'Out for delivery', 'Delivered'];

  return (
    <div className="order-detail">
      <Link to="/my/orders" className="back-link">
        ‹ Back to orders
      </Link>
      <div className="od-card">
        <p className="muted">Order ID # {order._id}</p>
        <p className="muted">Placed on {fmtDate(order.createdAt)}</p>
        <ol className={`tracker ${order.status === 'Cancelled' ? 'cancelled' : ''}`}>
          {steps.map((s, i) => (
            <li key={s} className={i === 0 || order.status === 'Cancelled' ? 'done' : ''}>
              {s}
            </li>
          ))}
        </ol>
        {order.status === 'Placed' &&
          (confirming ? (
            <div className="cancel-confirm">
              <span>Cancel this order?</span>
              <button type="button" className="btn btn-primary btn-sm" onClick={cancel}>
                YES, CANCEL
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirming(false)}>
                NO
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirming(true)}>
              CANCEL ORDER
            </button>
          ))}
      </div>

      <div className="od-card">
        {order.items.map((i) => (
          <Link key={i._id} to={`/product/${i.product}`} className="order-item">
            <img src={i.thumbnail} alt="" />
            <div>
              <b>{i.brand}</b>
              <p>{i.title}</p>
              <span>
                Size: {i.size} · Qty: {i.qty} · {formatPrice(i.price * i.qty)}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="od-grid">
        <div className="od-card">
          <h4>Delivery Address</h4>
          <p>
            <b>{a.name}</b> · {a.mobile}
          </p>
          <p>
            {a.line1}
            {a.locality && `, ${a.locality}`}, {a.city}, {a.state} - {a.pincode}
          </p>
        </div>
        <div className="od-card">
          <h4>Total Order Price</h4>
          <div className="pd-row">
            <span>Total MRP</span>
            <span>{formatPrice(order.totalMrp)}</span>
          </div>
          <div className="pd-row">
            <span>Discount on MRP</span>
            <span className="green">-{formatPrice(order.discount)}</span>
          </div>
          {order.couponDiscount > 0 && (
            <div className="pd-row">
              <span>Coupon ({order.couponCode})</span>
              <span className="green">-{formatPrice(order.couponDiscount)}</span>
            </div>
          )}
          <div className="pd-row">
            <span>Platform Fee</span>
            <span>{formatPrice(order.platformFee)}</span>
          </div>
          <div className="pd-row pd-total">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <p className="muted">Paid by {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</p>
        </div>
      </div>
    </div>
  );
}
