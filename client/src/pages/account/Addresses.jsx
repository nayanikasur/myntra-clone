import { useEffect, useState } from 'react';
import { api } from '../../api';
import AddressCard from '../../components/AddressCard';
import AddressForm from '../../components/AddressForm';
import { useToast } from '../../context/ToastContext';

export default function Addresses() {
  const toast = useToast();
  const [addresses, setAddresses] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    api('/addresses').then(setAddresses).catch(() => setAddresses([]));
  }, []);

  const save = async (form) => {
    const list = form._id
      ? await api(`/addresses/${form._id}`, { method: 'PUT', body: form })
      : await api('/addresses', { method: 'POST', body: form });
    setAddresses(list);
    setEditing(null);
    toast('Address saved', 'success');
  };

  const remove = async (id) => {
    setAddresses(await api(`/addresses/${id}`, { method: 'DELETE' }));
    toast('Address removed', 'success');
  };

  if (!addresses) return <div className="page-loader" />;

  return (
    <div>
      <div className="address-head">
        <h3 className="account-title">Saved Addresses</h3>
        <button type="button" className="btn btn-outline-pink btn-sm" onClick={() => setEditing({})}>
          + ADD NEW ADDRESS
        </button>
      </div>
      {addresses.length === 0 && (
        <div className="empty-state">
          <h3>Save your addresses now</h3>
          <p>Add your home and office addresses and enjoy faster checkout</p>
        </div>
      )}
      {addresses.map((a) => (
        <AddressCard key={a._id} address={a} onEdit={() => setEditing(a)} onRemove={() => remove(a._id)} />
      ))}
      {editing && <AddressForm initial={editing} onSubmit={save} onClose={() => setEditing(null)} />}
    </div>
  );
}
