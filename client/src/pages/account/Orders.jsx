import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice } from '../../api';
import { BagIcon } from '../../components/Icons';

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api('/orders').then(setOrders).catch(() => setOrders([]));
  }, []);

  if (!orders) return <div className="page-loader" />;

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <BagIcon width="80" height="80" className="empty-icon" />
        <h3>You haven't placed any order yet!</h3>
        <p>Order section is empty. After placing an order, you can track it from here!</p>
        <Link to="/" className="btn btn-primary">
          START SHOPPING
        </Link>
      </div>
    );
  }

  const shown = orders.filter((o) => filter === 'all' || o.status === filter);

  return (
    <div>
      <div className="orders-head">
        <div>
          <h3>All orders</h3>
          <p className="muted">from anytime</p>
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="orders-filter">
          <option value="all">All</option>
          <option value="Placed">On the way</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      {shown.map((o) => (
        <Link key={o._id} to={`/my/orders/${o._id}`} className="order-block">
          <div className="order-status">
            <span className={`status-dot ${o.status.toLowerCase()}`}>{o.status === 'Placed' ? '✓' : '✕'}</span>
            <div>
              <strong className={o.status === 'Cancelled' ? 'pink' : 'green'}>{o.status === 'Placed' ? 'Confirmed' : o.status}</strong>
              <p className="muted">On {fmtDate(o.status === 'Cancelled' ? o.cancelledAt || o.updatedAt : o.createdAt)}</p>
            </div>
            <strong className="order-total">{formatPrice(o.total)}</strong>
          </div>
          {o.items.map((i) => (
            <div key={i._id} className="order-item">
              <img src={i.thumbnail} alt="" />
              <div>
                <b>{i.brand}</b>
                <p>{i.title}</p>
                <span>
                  Size: {i.size} · Qty: {i.qty}
                </span>
              </div>
              <span className="chev">›</span>
            </div>
          ))}
        </Link>
      ))}
    </div>
  );
}
