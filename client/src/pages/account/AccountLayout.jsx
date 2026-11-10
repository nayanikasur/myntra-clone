import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  ['Overview', '/my/dashboard'],
  null,
  ['ORDERS', null],
  ['Orders & Returns', '/my/orders'],
  null,
  ['CREDITS', null],
  ['Coupons', '/my/coupons'],
  null,
  ['ACCOUNT', null],
  ['Profile', '/my/profile'],
  ['Saved Addresses', '/my/addresses'],
  ['Wishlist', '/wishlist'],
  null,
  ['LEGAL', null],
  ['Terms of Use', '/termsofuse'],
  ['Privacy Policy', '/privacypolicy'],
];

export default function AccountLayout() {
  const { user } = useAuth();
  return (
    <div className="account">
      <div className="account-head">
        <h2>Account</h2>
        <p>{user.name}</p>
      </div>
      <div className="account-body">
        <nav className="account-nav">
          {LINKS.map((l, i) =>
            !l ? (
              <hr key={i} />
            ) : l[1] ? (
              <NavLink key={l[0]} to={l[1]}>
                {l[0]}
              </NavLink>
            ) : (
              <span key={l[0]} className="account-nav-title">
                {l[0]}
              </span>
            )
          )}
        </nav>
        <section className="account-content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
