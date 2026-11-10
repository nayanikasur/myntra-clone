import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api';
import AddressCard from '../components/AddressCard';
import AddressForm from '../components/AddressForm';
import PriceDetails from '../components/PriceDetails';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';

export default function Address() {
  const { cart, coupon, addressId, setAddressId } = useShop();
  const toast = useToast();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(null);
  const [editing, setEditing] = useState(null); // null | {} (new) | address

  useEffect(() => {
    api('/addresses')
      .then((list) => {
        setAddresses(list);
        if (!list.length) setEditing({});
      })
      .catch((e) => toast(e.message, 'error'));
  }, [toast]);

  // keep a valid selection: previous choice, else the default address
  useEffect(() => {
    if (!addresses?.length) return;
    if (!addresses.some((a) => a._id === addressId)) setAddressId((addresses.find((a) => a.isDefault) || addresses[0])._id);
  }, [addresses, addressId, setAddressId]);

  if (cart.length === 0) return <Navigate to="/checkout/cart" replace />;

  const save = async (form) => {
    const list = form._id
      ? await api(`/addresses/${form._id}`, { method: 'PUT', body: form })
      : await api('/addresses', { method: 'POST', body: form });
    setAddresses(list);
    if (!form._id) setAddressId(list[list.length - 1]._id);
    setEditing(null);
  };

  const remove = async (id) => {
    setAddresses(await api(`/addresses/${id}`, { method: 'DELETE' }));
  };

  const defaults = addresses?.filter((a) => a.isDefault) || [];
  const others = addresses?.filter((a) => !a.isDefault) || [];

  return (
    <div className="checkout-layout">
      <section className="checkout-left">
        <div className="address-head">
          <h3>Select Delivery Address</h3>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing({})}>
            ADD NEW ADDRESS
          </button>
        </div>
        {!addresses && <div className="page-loader" />}
        {[
          ['DEFAULT ADDRESS', defaults],
          ['OTHER ADDRESS', others],
        ].map(
          ([title, list]) =>
            list.length > 0 && (
              <div key={title}>
                <h5 className="address-group">{title}</h5>
                {list.map((a) => (
                  <AddressCard
                    key={a._id}
                    address={a}
                    selected={a._id === addressId}
                    onSelect={() => setAddressId(a._id)}
                    onEdit={() => setEditing(a)}
                    onRemove={() => remove(a._id)}
                  />
                ))}
              </div>
            )
        )}
        <button type="button" className="add-address-tile" onClick={() => setEditing({})}>
          + Add New Address
        </button>
      </section>

      <aside className="checkout-right">
        <PriceDetails cart={cart} coupon={coupon}>
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!addressId}
            onClick={() => navigate('/checkout/payment')}
          >
            CONTINUE
          </button>
        </PriceDetails>
      </aside>

      {editing && <AddressForm initial={editing} onSubmit={save} onClose={() => setEditing(null)} />}
    </div>
  );
}
