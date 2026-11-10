import { useState } from 'react';
import { CloseIcon } from './Icons';

const EMPTY = { name: '', mobile: '', pincode: '', line1: '', locality: '', city: '', state: '', type: 'HOME', isDefault: false };

// Modal form used both at checkout and in the account's saved addresses
export default function AddressForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(form.mobile)) return setError('Please enter a valid 10-digit mobile number');
    if (!/^\d{6}$/.test(form.pincode)) return setError('Please enter a valid 6-digit pincode');
    setBusy(true);
    setError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal address-modal" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
        <div className="coupon-modal-head">
          <h4>{initial?._id ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}</h4>
          <button type="button" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="address-modal-body">
          <h5>CONTACT DETAILS</h5>
          <input placeholder="Name*" value={form.name} onChange={set('name')} required />
          <input placeholder="Mobile No*" value={form.mobile} onChange={set('mobile')} inputMode="numeric" maxLength={10} required />
          <h5>ADDRESS</h5>
          <input placeholder="Pin Code*" value={form.pincode} onChange={set('pincode')} inputMode="numeric" maxLength={6} required />
          <input placeholder="Address (House No, Building, Street, Area)*" value={form.line1} onChange={set('line1')} required />
          <input placeholder="Locality / Town" value={form.locality} onChange={set('locality')} />
          <div className="two-col">
            <input placeholder="City / District*" value={form.city} onChange={set('city')} required />
            <input placeholder="State*" value={form.state} onChange={set('state')} required />
          </div>
          <h5>SAVE ADDRESS AS</h5>
          <div className="type-chips">
            {['HOME', 'WORK'].map((t) => (
              <button key={t} type="button" className={`chip ${form.type === t ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, type: t })}>
                {t === 'HOME' ? 'Home' : 'Work'}
              </button>
            ))}
          </div>
          <label className="filter-option default-check">
            <input type="checkbox" checked={form.isDefault} onChange={set('isDefault')} /> Make this my default address
          </label>
          {error && <p className="error-text">{error}</p>}
        </div>
        <div className="address-modal-foot">
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'SAVING…' : 'SAVE ADDRESS'}
          </button>
        </div>
      </form>
    </div>
  );
}
