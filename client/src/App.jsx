import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CheckoutHeader from './components/CheckoutHeader';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Bag from './pages/Bag';
import Address from './pages/Address';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import InfoPage, { INFO_SLUGS } from './pages/InfoPage';
import NotFound from './pages/NotFound';
import AccountLayout from './pages/account/AccountLayout';
import Overview from './pages/account/Overview';
import Orders from './pages/account/Orders';
import OrderDetail from './pages/account/OrderDetail';
import Coupons from './pages/account/Coupons';
import Addresses from './pages/account/Addresses';
import ProfileDetails from './pages/account/ProfileDetails';
import RequireAuth from './components/RequireAuth';

export default function App() {
  const { pathname } = useLocation();
  const inCheckout = pathname.startsWith('/checkout');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {inCheckout ? <CheckoutHeader /> : <Header />}
      <main className={inCheckout ? 'main checkout-main' : 'main'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:gender" element={<ProductList />} />
          <Route path="/search" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout/cart" element={<RequireAuth><Bag /></RequireAuth>} />
          <Route path="/checkout/address" element={<RequireAuth><Address /></RequireAuth>} />
          <Route path="/checkout/payment" element={<RequireAuth><Payment /></RequireAuth>} />
          <Route path="/checkout/success/:id" element={<RequireAuth><OrderSuccess /></RequireAuth>} />
          <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} />
          <Route path="/my" element={<RequireAuth><AccountLayout /></RequireAuth>}>
            <Route index element={<Navigate to="/my/dashboard" replace />} />
            <Route path="dashboard" element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="profile" element={<ProfileDetails />} />
          </Route>
          <Route path="/profile" element={<Navigate to="/my/dashboard" replace />} />
          {INFO_SLUGS.map((s) => (
            <Route key={s} path={`/${s}`} element={<InfoPage />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!inCheckout && <Footer />}
    </>
  );
}
