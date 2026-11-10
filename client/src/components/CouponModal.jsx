import { useEffect, useState } from 'react';
import { api, formatPrice } from '../api';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { CloseIcon } from './Icons';

export default function CouponModal({ onClose }) {
  const { coupon, setCoupon } = useShop();
  const toast = useToast();
  const [list, setList] = useState(null);
  const [selected, setSelected] = useState(coupon?.code || '');
  const [typed, setTyped] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api('/coupons').then(setList).catch((e) => setError(e.message));
  }, []);

  const apply = async (code) => {
    setError('');
    if (!code) {
      setCoupon(null);
      return onClose();
    }
    try {
      const r = await api('/coupons/apply', { method: 'POST', body: { code } });
      setCoupon(r);
      toast(`Coupon ${r.code} applied. You saved ${formatPrice(r.discount)}`, 'success');
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  const preview = list?.find((c) => c.code === selected);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal coupon-modal" onClick={(e) => e.stopPropagation()}>
        <div className="coupon-modal-head">
          <h4>APPLY COUPON</h4>
          <button type="button" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <form
          className="coupon-input"
          onSubmit={(e) => {
            e.preventDefault();
            apply(typed.trim());
          }}
        >
          <input value={typed} onChange={(e) => setTyped(e.target.value.toUpperCase())} placeholder="Enter coupon code" />
          <button type="submit" disabled={!typed.trim()}>
            CHECK
          </button>
        </form>
        {error && <p className="error-text">{error}</p>}

        <div className="coupon-list">
          {!list && !error && <div className="page-loader" />}
          {list?.map((c) => (
            <label key={c.code} className={`coupon-item ${c.applicable ? '' : 'disabled'}`}>
              <input
                type="checkbox"
                disabled={!c.applicable}
                checked={selected === c.code}
                onChange={() => setSelected(selected === c.code ? '' : c.code)}
              />
              <div>
                <span className="coupon-code-tag">{c.code}</span>
                {c.applicable ? <p className="save">Save {formatPrice(c.discount)}</p> : <p className="reason">{c.reason}</p>}
                <p>{c.title}</p>
                <p className="muted">Minimum purchase of {formatPrice(c.minAmount)}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="coupon-modal-foot">
          <div>
            <span>Maximum savings:</span>
            <strong>{formatPrice(preview?.discount || 0)}</strong>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => apply(selected)}>
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
}
