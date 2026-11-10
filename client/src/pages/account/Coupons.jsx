import { useEffect, useState } from 'react';
import { api, formatPrice } from '../../api';

// "10% off up to ₹500" -> "10%", "Flat ₹300 off" -> "₹300"
const offLabel = (title) => title.match(/\d+%/)?.[0] || title.match(/₹\d+/)?.[0] || '%';

export default function Coupons() {
  const [list, setList] = useState(null);

  useEffect(() => {
    api('/coupons').then(setList).catch(() => setList([]));
  }, []);

  if (!list) return <div className="page-loader" />;

  return (
    <div>
      <h3 className="account-title">Coupons</h3>
      <ul className="coupon-cards">
        {list.map((c) => (
          <li key={c.code} className="coupon-card">
            <div className="cc-left">
              <strong>{offLabel(c.title)}</strong>
              <span>OFF</span>
            </div>
            <div className="cc-right">
              <p>{c.title}</p>
              <p className="muted">On minimum purchase of {formatPrice(c.minAmount)}</p>
              <p>
                Code: <b>{c.code}</b>
              </p>
              {!c.applicable && <p className="muted small">{c.reason}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
