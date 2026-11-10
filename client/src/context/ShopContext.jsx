import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  // checkout choices carried from Bag -> Address -> Payment
  const [coupon, setCoupon] = useState(null); // { code, discount }
  const [addressId, setAddressId] = useState(null);

  // a coupon's value depends on the bag, so re-check it whenever the bag changes
  useEffect(() => {
    if (!coupon || cart.length === 0) return;
    api('/coupons/apply', { method: 'POST', body: { code: coupon.code } })
      .then((r) => {
        if (r.discount !== coupon.discount) setCoupon(r);
      })
      .catch((e) => {
        setCoupon(null);
        toast(`Coupon removed: ${e.message}`, 'error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  useEffect(() => {
    setCoupon(null);
    setAddressId(null);
    if (!user) {
      setCart([]);
      setWishlist([]);
      return;
    }
    api('/cart').then(setCart).catch(() => {});
    api('/wishlist').then(setWishlist).catch(() => {});
  }, [user]);

  const requireLogin = () => {
    if (user) return true;
    navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    return false;
  };

  const run = async (fn, setter, successMsg) => {
    try {
      setter(await fn());
      if (successMsg) toast(successMsg, 'success');
      return true;
    } catch (e) {
      toast(e.message, 'error');
      return false;
    }
  };

  const addToCart = (productId, size, qty = 1) =>
    requireLogin() && run(() => api('/cart', { method: 'POST', body: { productId, size, qty } }), setCart, 'Added to bag');
  const updateCartItem = (itemId, changes) =>
    run(() => api(`/cart/${itemId}`, { method: 'PATCH', body: changes }), setCart);
  const removeCartItem = (itemId) => run(() => api(`/cart/${itemId}`, { method: 'DELETE' }), setCart, 'Item removed from bag');

  const isWishlisted = (productId) => wishlist.some((p) => p._id === productId);
  const toggleWishlist = (productId) => {
    if (!requireLogin()) return false;
    return isWishlisted(productId)
      ? run(() => api(`/wishlist/${productId}`, { method: 'DELETE' }), setWishlist, 'Removed from wishlist')
      : run(() => api(`/wishlist/${productId}`, { method: 'POST' }), setWishlist, 'Added to wishlist');
  };

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        setCart,
        cartCount,
        coupon,
        setCoupon,
        addressId,
        setAddressId,
        addToCart,
        updateCartItem,
        removeCartItem,
        wishlist,
        isWishlisted,
        toggleWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
